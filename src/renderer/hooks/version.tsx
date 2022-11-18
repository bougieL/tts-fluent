import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAsync } from 'react-use';
import axios from 'axios';

import { openSubWindow } from 'renderer/lib';

import pkg from '../../../release/app/package.json';

const { version } = pkg;

function formatVersion(version: string) {
  return Number(
    version
      .replace(/-.*/, '')
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
  forceUpdate: boolean;
}

export async function checkUpdate(): Promise<VersionContextValue> {
  let remoteVersion = '';
  let hasUpdate = false;
  let forceUpdate = false;
  let changeLog = '';
  try {
    [remoteVersion, changeLog] = await axios
      .get('https://api.github.com/repos/bougieL/tts-fluent/releases/latest')
      .then(({ data }) => [data.tag_name, data.body]);
    remoteVersion = '1.0.0';
    hasUpdate = formatVersion(remoteVersion) > formatVersion(version);
    const rmv = remoteVersion.split('.')[0].replace(/[a-zA-Z]/g, '');
    const lmv = version.split('.')[0].replace(/[a-zA-Z]/gi, '');
    forceUpdate = rmv > lmv;
    console.log({ rmv, lmv });
  } catch (error) {
    // hasUpdate = false;
    // forceUpdate = false;
  }
  return {
    remoteVersion,
    hasUpdate,
    changeLog,
    forceUpdate,
  };
}

const defaultValue: VersionContextValue = {
  remoteVersion: '',
  hasUpdate: false,
  changeLog: '',
  forceUpdate: false,
};

const context = createContext<VersionContextValue>(defaultValue);

export function Version(props: PropsWithChildren<any>) {
  const [value, setValue] = useState(defaultValue);
  useAsync(async () => {
    setValue(await checkUpdate());
  }, []);

  // useEffect(() => {
  //   if (value.forceUpdate) {
  //     console.log('open /window/forceUpdate');
  //     openSubWindow('/window/forceUpdate', {
  //       title: 'Update to latest version',
  //       closable: false,
  //       minimizable: false,
  //       maximizable: false,
  //     });
  //   }
  // }, [value.forceUpdate]);

  return <context.Provider value={value} {...props} />;
}

export function useVersion() {
  return useContext(context);
}
