import { ComponentType, FC, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Stack } from '@mantine/core';

import { IpcEvents } from 'const';

import { Header } from './Header';

export function withWindow<P extends { initialData: any }>(
  Component: ComponentType<P>
) {
  const NamedComponent: FC<Omit<P, 'initialData'>> = (props) => {
    const [initialData, setInitialData] = useState(undefined);
    ipcRenderer.on(IpcEvents.subWindowInitialData, (_, data) => {
      // console.log(store);
      setInitialData(data || null);
    });
    if (initialData === undefined) {
      return null;
    }
    return (
      <>
        <Header />
        <Stack className='main'>
          {/* @ts-ignore */}
          <Component {...props} initialData={initialData} />
        </Stack>
      </>
    );
  };

  return NamedComponent;
}
