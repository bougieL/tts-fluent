import { createContext, PropsWithChildren, useContext, useState } from 'react';
import axios from 'axios';
import { IpcEvents } from 'const';
import { ipcRenderer } from 'electron';
import { useAsync } from './external';

function formatVersion(version: string) {
  return Number(
    version
      .replace(/\w/g, '')
      .split('.')
      .map((item) => item.padStart(2, '0'))
      .join('')
  );
}

interface VersionContextValue {
  localVersion: string;
  remoteVersion: string;
  hasUpdate: boolean;
}

export async function checkUpdate(): Promise<VersionContextValue> {
  let localVersion = '';
  let remoteVersion = '';
  let hasUpdate = false;
  try {
    localVersion = await ipcRenderer.invoke(IpcEvents.electronAppGetVersion);
    remoteVersion = await axios
      .get('https://api.github.com/repos/bougieL/tts-fluent/releases/latest')
      .then(({ data }) => data.tag_name);
    hasUpdate = formatVersion(remoteVersion) > formatVersion(localVersion);
  } catch (error) {
    hasUpdate = false;
  }
  return {
    localVersion,
    remoteVersion,
    hasUpdate,
  };
}

const defaultValue: VersionContextValue = {
  localVersion: '',
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
