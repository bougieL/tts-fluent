import React from 'react';

import {
  IconDownload,
  IconMicrophone,
  IconPokeball,
  IconSend,
  IconSettings,
} from 'renderer/components';

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

export const mainRoutes: Array<
  RouteConfig<{
    Icon: React.ComponentType<{ size?: string | number }>;
  }>
> = [
  {
    path: '/',
    Component: MicrosoftTTS,
    Icon: IconMicrophone,
  },
  {
    path: '/ttsCat',
    Component: TTSCat,
    Icon: IconPokeball,
  },
  {
    path: '/transfer',
    Component: Transfer,
    Icon: IconSend,
  },
  {
    path: '/downloads',
    Component: Downloads,
    Icon: IconDownload,
  },
  {
    path: '/settings',
    Component: Settings,
    Icon: IconSettings,
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
