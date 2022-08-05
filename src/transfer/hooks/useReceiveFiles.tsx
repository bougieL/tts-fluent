import { Stack, Text } from '@fluentui/react';
import { TransferType } from 'const/Transfer';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';
import { saveByObjectUrl } from 'transfer/lib/saveFile';
import { fetchFile } from 'transfer/requests';
import { useServer } from './useServer';
import { useServerAliveSse } from './useServerAliveSse';

export function useReceiveFiles() {
  const server = useServer();
  const toastsRef = useRef(new Map<string, Id>());
  const handleProgressChange = (event: any, path: string) => {
    const toastId = toastsRef.current.get(path);
    const progress = event.loaded / event.total;
    const filename = path.split('/').pop();
    if (toastId) {
      toast.update(toastId, { progress });
    } else {
      toastsRef.current.set(
        path,
        toast(
          <Stack>
            <Text variant="medium">
              Receiving {filename} from {server?.serverName}
            </Text>
            <Text variant="small">Do not close this page before success</Text>
          </Stack>,
          { progress, closeButton: false }
        )
      );
    }
  };
  useServerAliveSse(({ type, payload }) => {
    if (type === TransferType.sendFiles) {
      // console.log(payload);
      payload.forEach(async ({ path }: { path: string }) => {
        const name = path.split('/').pop() || String(Date.now());
        if (toastsRef.current.get(path)) return;
        try {
          const data = await fetchFile(path, (event) =>
            handleProgressChange(event, path)
          );
          saveByObjectUrl(data, name);
          const toastId = toastsRef.current.get(path);
          if (toastId) {
            toast.update(toastId, {
              type: 'success',
              autoClose: 3000,
              closeButton: true,
            });
            // toast.done(toastId);
            toastsRef.current.delete(path);
          }
        } catch (error) {
          const toastId = toastsRef.current.get(path);
          if (toastId) {
            toast.update(toastId, {
              type: 'error',
              autoClose: 3000,
              closeButton: true,
            });
            // toast.done(toastId);
            // toast.done(toastId);
            toastsRef.current.delete(path);
          }
        }
      });
    }
  });
}
