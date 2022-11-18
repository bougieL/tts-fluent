import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

export interface SubWindowBaseOptions
  extends Omit<BrowserWindowConstructorOptions, 'parent'> {
  title?: string;
  singleton?: boolean;
  parent?: BrowserWindow | null;
  modal?: boolean;
  initialData?: any;
}
