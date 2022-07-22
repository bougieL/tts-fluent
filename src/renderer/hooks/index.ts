import { useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export function useFn<T extends Function>(callback: T): T {
  const ref = useRef(callback);

  ref.current = callback;

  return ref.current;
}

export * from './audio';
export * from './downloads';
export * from './external';
export * from './version';
