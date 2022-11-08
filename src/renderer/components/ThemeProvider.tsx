import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { ipcRenderer } from 'electron';
import { MantineProvider } from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';

import { IpcEvents, ThemeVariant } from 'const';
import { useFn } from 'renderer/hooks';

const themeVariantContext = createContext(ThemeVariant.system);
const themeVariantSetterContext = createContext<(v: ThemeVariant) => void>(
  () => {}
);

export function useThemeVariant() {
  return [
    useContext(themeVariantContext),
    useContext(themeVariantSetterContext),
  ] as const;
}

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const initialSystemColorScheme = useRef<'dark' | 'light'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  ).current;

  const systemColorScheme = useColorScheme(initialSystemColorScheme, {
    getInitialValueInEffect: false,
  });

  const [themeVariant, setLThemeVariant] = useLocalStorage<ThemeVariant>({
    key: 'theme-variant',
    getInitialValueInEffect: false,
    defaultValue: ThemeVariant.system,
  });

  const setThemeVariant = useFn((theme: ThemeVariant) => {
    setLThemeVariant(theme);
    ipcRenderer.send(IpcEvents.themeChange, theme);
  });

  const colorScheme = useMemo(() => {
    if (themeVariant === ThemeVariant.system) {
      return systemColorScheme;
    }
    return themeVariant;
  }, [systemColorScheme, themeVariant]);

  return (
    <themeVariantContext.Provider value={themeVariant}>
      <themeVariantSetterContext.Provider value={setThemeVariant}>
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          {children}
        </MantineProvider>
      </themeVariantSetterContext.Provider>
    </themeVariantContext.Provider>
  );
};
