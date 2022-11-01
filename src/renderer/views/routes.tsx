import React from 'react';

import CodeEditor from './CodeEditor';
import Downloads from './Downloads';
import Markdown from './Markdown';
import MicrosoftTTS from './MicrosoftTTS';
import Settings from './Settings';
import Transfer from './Transfer';
import TTSCat from './TTSCat';
import TTSCatEditor from './TTSCatEditor';

type RouteConfig<T = {}> = {
  path: string;
  Component: React.ComponentType;
} & T;

export const mainRoutes: RouteConfig[] = [
  {
    path: '/',
    Component: MicrosoftTTS,
  },
  {
    path: '/ttsCat',
    Component: TTSCat,
  },
  {
    path: '/transfer',
    Component: Transfer,
  },
  {
    path: '/downloads',
    Component: Downloads,
  },
  {
    path: '/settings',
    Component: Settings,
  },
];

export const windowRoutes: RouteConfig[] = [
  {
    path: 'markdown',
    Component: Markdown,
  },
  {
    path: 'ttsCatEditor',
    Component: TTSCatEditor,
  },
  {
    path: 'codeEditor',
    Component: CodeEditor,
  },
];
