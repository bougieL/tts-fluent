import IpcEvents from 'constants/IpcEvents';
import { contextBridge, ipcRenderer, IpcRendererEvent, shell } from 'electron';

export type Channels = 'ipc-example' | IpcEvents;

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke: ipcRenderer.invoke,
  },
  dialog: {
    showOpenDialog: (...args: any[]) =>
      ipcRenderer.invoke('electron.dialog.showOpenDialog', ...args),
    showOpenDialogSync: (...args: any[]) =>
      ipcRenderer.invoke('electron.dialog.showOpenDialogSync', ...args),
  },
  app: {
    getPath: (...args: any[]) =>
      ipcRenderer.invoke('electron.app.getPath', ...args),
  },
  shell: {
    showItemInFolder: (fullPath: string) => {
      return ipcRenderer.invoke('electron.shell.showItemInFolder', fullPath);
    },
  },
});
