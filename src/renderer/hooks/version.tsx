import { createContext, PropsWithChildren, useContext, useState } from 'react';
import axios from 'axios';
import { APP_VERSION } from 'const';
import { useAsync } from './external';

function formatVersion(version: string) {
  return Number(
    version
      .replace(/[A-Za-z]/g, '')
      .split('.')
      .map((item) => item.padStart(2, '0'))
      .join('')
  );
}

interface VersionContextValue {
  remoteVersion: string;
  hasUpdate: boolean;
}

export async function checkUpdate(): Promise<VersionContextValue> {
  let remoteVersion = '';
  let hasUpdate = false;
  try {
    remoteVersion = await axios
      .get('https://api.github.com/repos/bougieL/tts-fluent/releases/latest')
      .then(({ data }) => data.tag_name);
    hasUpdate = formatVersion(remoteVersion) > formatVersion(APP_VERSION);
  } catch (error) {
    hasUpdate = false;
  }
  return {
    remoteVersion,
    hasUpdate,
  };
}

const defaultValue: VersionContextValue = {
  remoteVersion: '',
  hasUpdate: false,
};

const context = createContext<VersionContextValue>(defaultValue);

export function Version(props: PropsWithChildren<any>) {
  const [value, setValue] = useState(defaultValue);
  useAsync(async () => {
    setValue(await checkUpdate());
  }, []);
  return <context.Provider value={value} {...props} />;
}

export function useVersion() {
  return useContext(context);
}
