import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

export interface SubWindowBaseOptions extends BrowserWindowConstructorOptions {
  title?: string;
  singleton?: boolean;
  parent?: BrowserWindow;
  modal?: boolean;
  initialData?: any;
}
