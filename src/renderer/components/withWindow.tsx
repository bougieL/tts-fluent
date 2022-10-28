import { ComponentType, FC, useState } from 'react';
import { ipcRenderer } from 'electron';

import { IpcEvents } from 'const';

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
    // @ts-ignore
    return <Component {...props} initialData={initialData} />;
  };

  return NamedComponent;
}
