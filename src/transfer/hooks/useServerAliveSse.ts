import { TransferType } from 'const/Transfer';
import { useEffect } from 'react';
import { serverAliveSse } from 'transfer/requests';

type Callback = (data: { type: TransferType; payload: any }) => void;

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

interface TransferPayloadMap {
  [TransferType.heartbeat]: {
    deviceName: string;
    deviceHost: string;
  };
  [TransferType.getClipboard]: void;
  [TransferType.sendClipboard]: string;
  [TransferType.getFiles]: void;
  [TransferType.sendFiles]: string[];
}

export type TransferPayload<T extends TransferType> = TransferPayloadMap[T];
