import path from 'path';

import { MarkdownType } from 'const/Markdown';
import { isDev } from 'lib/env';

export function showMarkdown(
  content: string,
  options?: {
    type?: MarkdownType;
    title?: string;
    width?: number;
    height?: number;
  }
) {
  const type = options?.type || MarkdownType.default;
  const title = options?.title || '';
  const width = options?.width || 400;
  const height = options?.height || 500;
  const prodUrl = `file://${path.resolve(
    __dirname,
    'index.html'
  )}#/window/markdown`;
  const href = isDev ? '/#/window/markdown' : prodUrl;
  const subWindow = window.open(href, '', `width=${width},height=${height}`);
  if (subWindow) {
    subWindow.global = subWindow;
    if (title) {
      subWindow.document.title = title;
    }
    subWindow.initialData = {
      title,
      type,
      content,
    };
  }
}
