import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

export interface SubWindowBaseOptions
  extends Omit<BrowserWindowConstructorOptions, 'parent'> {
  title?: string;
  singleton?: boolean;
  parent?: BrowserWindow | null;
  modal?: boolean;
  initialData?: any;
}

export interface BadanmuConfig {
  platform: string;
  roomId: string | number;
}

export interface IBadanmuSetting {
  background: boolean;
  speak: boolean;
  aiChat: boolean;
  width: number;
  height: number;
  left: number;
  top: number;
  floatWindow: boolean;
}
