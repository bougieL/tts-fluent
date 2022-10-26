import path from 'path';

import { isDev } from 'lib/env';

export function openWindow<
  T extends { title?: string; width?: number; height?: number }
>(url: string, options?: T) {
  const title = options?.title || '';
  const width = options?.width || 400;
  const height = options?.height || 500;
  const prodUrl = `file://${path.resolve(__dirname, 'index.html')}#${url}`;
  const href = isDev ? `/#${url}` : prodUrl;
  const subWindow = window.open(href, '', `width=${width},height=${height}`);
  if (subWindow) {
    subWindow.global = subWindow;
    if (title) {
      subWindow.document.title = title;
    }
    subWindow.initialData = options;
  }
}
