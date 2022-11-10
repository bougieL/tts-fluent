import { BrowserWindow } from 'electron';

export interface SubWindowBaseOptions {
  title?: string;
  content?: string;
  singleton?: true;
  parent?: BrowserWindow;
  modal?: boolean;
}
