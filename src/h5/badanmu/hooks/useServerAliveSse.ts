import { useEffect } from 'react';

import { BadanmuState, BadanmuType } from 'const';

import { serverAliveSse } from '../requests';

type Callback = (data: { type: BadanmuType; payload: any }) => void;

const callbacks = new Set<Callback>();

serverAliveSse((data) => {
  callbacks.forEach((item) => item(data));
});

export function useServerAliveSse(callback: Callback) {
  useEffect(() => {
    callbacks.add(callback);
    return () => {
      callbacks.delete(callback);
    };
  }, [callback]);
}

// interface BadanmuPayloadMap {
//   [BadanmuType.heartbeat]: {
//     platform: string;
//     roomId: string;
//     state: BadanmuState;
//   };
//   [BadanmuType.connect]: {
//     platform: string;
//     roomId: string;
//   };
//   [BadanmuType.disconnect]: {
//     platform: string;
//     roomId: string;
//   };
//   [BadanmuType.message]: any;
// }

// export type BadanmuPayload<T extends BadanmuType> = BadanmuPayloadMap[T];
