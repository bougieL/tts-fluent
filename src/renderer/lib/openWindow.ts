import path from 'path';

import { isDev } from 'lib/env';

// const singletonWindowsMap = new Map<string, Window | null>();

export function openWindow<
  T extends {
    title?: string;
    width?: number;
    height?: number;
    singleton?: boolean;
  }
>(url: string, options?: T) {
  const title = options?.title || 'TTS Fluent';
  const width = options?.width || 400;
  const height = options?.height || 500;
  const singleton = options?.singleton ?? true;
  const prodUrl = `file://${path.resolve(__dirname, 'index.html')}#${url}`;
  const href = isDev ? `/#${url}` : prodUrl;
  // if (singleton) {
  //   const subWindow = singletonWindowsMap.get(href);
  //   if (subWindow) {
  //     subWindow.focus();
  //     return;
  //   }
  // }
  const subWindow = window.open(href, '', `width=${width},height=${height}`);
  if (!subWindow) return;
  subWindow.global = subWindow;
  subWindow.document.title = title;
  subWindow.initialData = options;
  // if (singleton) {
  //   singletonWindowsMap.set(href, subWindow);
  //   subWindow.onclose = () => {
  //     singletonWindowsMap.delete(href);
  //   };
  // }
}
