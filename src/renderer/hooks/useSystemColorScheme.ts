import { useRef } from 'react';
import { useColorScheme } from '@mantine/hooks';

export function useSystemColorScheme() {
  const initialSystemColorScheme = useRef<'dark' | 'light'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  ).current;

  const systemColorScheme = useColorScheme(initialSystemColorScheme, {
    getInitialValueInEffect: false,
  });

  return systemColorScheme;
}
