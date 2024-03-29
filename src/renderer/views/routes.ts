import React from 'react';
import {
  IconDownload,
  IconMicrophone,
  IconPokeball,
  IconSend,
  IconSettings,
} from '@tabler/icons';

import Badanmu from './Badanmu';
import ChangeLog from './ChangeLog';
import CodeEditor from './CodeEditor';
import Downloads from './Downloads';
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
    path: '/badanmu',
    Component: Badanmu,
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
    path: 'changeLog',
    Component: ChangeLog,
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
