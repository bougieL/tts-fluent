import { createContext, PropsWithChildren, useContext, useState } from 'react';
import axios from 'axios';

import { version } from '../../../release/app/package.json';

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
  changeLog: string;
}

export async function checkUpdate(): Promise<VersionContextValue> {
  let remoteVersion = '';
  let hasUpdate = false;
  let changeLog = '';
  try {
    [remoteVersion, changeLog] = await axios
      .get('https://api.github.com/repos/bougieL/tts-fluent/releases/latest')
      .then(({ data }) => [data.tag_name, data.body]);
    hasUpdate = formatVersion(remoteVersion) > formatVersion(version);
  } catch (error) {
    hasUpdate = false;
  }
  return {
    remoteVersion,
    hasUpdate,
    changeLog,
  };
}

const defaultValue: VersionContextValue = {
  remoteVersion: '',
  hasUpdate: false,
  changeLog: '',
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
