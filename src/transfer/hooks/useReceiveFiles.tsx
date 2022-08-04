import { Stack, Text } from '@fluentui/react';
import { TransferType } from 'const/Transfer';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';
import { getFile } from 'transfer/requests';
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
        toast.info(
          <Stack>
            <Text variant="medium">
              Receiving {filename} from {server?.serverName}
            </Text>
            <Text variant="small">Do not close this page before success</Text>
          </Stack>
        )
      );
    }
  };
  useServerAliveSse(({ type, payload }) => {
    if (type === TransferType.sendFiles) {
      // console.log(payload);
      payload.forEach(async ({ path }: { path: string; name: string }) => {
        if (toastsRef.current.get(path)) return;
        try {
          const stream = await getFile(path, (event) =>
            handleProgressChange(event, path)
          );
          const toastId = toastsRef.current.get(path);
          if (toastId) {
            toast.update(toastId, { type: 'success' });
            toast.done(toastId);
            toastsRef.current.delete(path);
          }
        } catch (error) {
          const toastId = toastsRef.current.get(path);
          if (toastId) {
            toast.error(toastId);
            toastsRef.current.delete(path);
          }
        }
      });
    }
  });
}
