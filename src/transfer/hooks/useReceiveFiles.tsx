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
    if (toastId) {
      toast.update(toastId, { progress });
    }
  };
  useServerAliveSse(({ type, payload }) => {
    if (type === TransferType.sendFiles) {
      // console.log(payload);
      payload.forEach(async ({ path }: { path: string }) => {
        const name = path.split('/').pop() || String(Date.now());
        if (toastsRef.current.get(path)) return;
        try {
          toastsRef.current.set(
            path,
            toast(
              <>
                Receiving {name} from {server?.serverName}
                <br />
                Do not close this page before success
              </>,
              { progress: 0, closeButton: false }
            )
          );
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
