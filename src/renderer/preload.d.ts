// import { app, dialog, ipcRenderer } from 'electron';
// import { Channels } from 'main/preload';

import { MarkdownType } from 'const/Markdown';

declare global {
  interface Window {
    global: Window;
    markdown: {
      type: MarkdownType;
      title: string;
      content: string;
    };
  }
}

// declare global {
//   interface Window {
//     electron: {
//       ipcRenderer: {
//         send(channel: Channels, args: unknown[]): void;
//         on(
//           channel: string,
//           func: (...args: unknown[]) => void
//         ): (() => void) | undefined;
//         once(channel: string, func: (...args: unknown[]) => void): void;
//         invoke: typeof ipcRenderer.invoke;
//       };
//       dialog: {
//         showOpenDialog: typeof dialog.showOpenDialog;
//         showOpenDialogSync: (
//           ...params: Parameters<typeof dialog.showOpenDialogSync>
//         ) => Promise<string[] | undefined>;
//       };
//       app: {
//         getPath: (...params: Parameters<typeof app.getPath>) => Promise<string>;
//       };
//       shell: {
//         showItemInFolder: (fullPath: string) => Promise<void>;
//       };
//     };
//   }
// }
