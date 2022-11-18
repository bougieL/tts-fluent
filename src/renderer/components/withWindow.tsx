import { ComponentType, FC, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { ipcRenderer } from 'electron';
import { Stack } from '@mantine/core';

import { IpcEvents } from 'const';

import { Header } from './Header';

export function withWindow<P extends { title?: string; initialData?: any }>(
  Component: ComponentType<P>
) {
  const NamedComponent: FC<Omit<P, 'title' | 'initialData'>> = (props) => {
    const [title, setTitle] = useState(undefined);
    const [initialData, setInitialData] = useState(undefined);
    ipcRenderer.on(IpcEvents.subWindowInitialData, (_, data) => {
      // console.log(store);
      unstable_batchedUpdates(() => {
        setTitle(data?.title);
        setInitialData(data?.initialData);
      });
    });
    if (initialData === undefined) {
      return null;
    }
    return (
      <>
        <Header />
        <Stack className='main'>
          {/* @ts-ignore */}
          <Component {...props} title={title} initialData={initialData} />
        </Stack>
      </>
    );
  };

  return NamedComponent;
}
