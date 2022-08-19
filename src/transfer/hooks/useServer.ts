import { createContext, useContext } from 'react';

export const serverContext = createContext<
  | {
      serverName: string;
      serverHost: string;
    }
  | undefined
>(undefined);

export function useServer() {
  return useContext(serverContext);
}
