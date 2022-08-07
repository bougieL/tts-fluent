import { TransferType } from 'const/Transfer';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';
import { saveByObjectUrl } from 'transfer/lib/saveFile';
import { fetchFile, getFile } from 'transfer/requests';
import { useServer } from './useServer';
import { useServerAliveSse } from './useServerAliveSse';

export function useReceiveFiles() {
  const server = useServer();
  const taostIdRef = useRef<Id>();
  const handleProgress = (event: any) => {
    // console.log(event);
    if (taostIdRef.current) {
      const progress = event.loaded / event.total;
      // console.log(progress);
      toast.update(taostIdRef.current, {
        progress,
      });
    }
  };
  useServerAliveSse(async ({ type, payload }) => {
    if (type === TransferType.sendFiles) {
      const downloadFiles = async () => {
        // eslint-disable-next-line no-restricted-syntax
        for (const { path } of payload) {
          const name = path.split('/').pop() || String(Date.now());
          // eslint-disable-next-line no-await-in-loop
          const data = await getFile(path, handleProgress);
          saveByObjectUrl(data, name);
        }
      };
      try {
        taostIdRef.current = toast.loading(
          <>
            Receiving files from {server?.serverName}
            <br />
            Do not close this page before success
          </>,
          { progress: 0, closeButton: false }
        );
        await downloadFiles();
        if (taostIdRef.current) {
          toast.update(taostIdRef.current, {
            type: 'success',
            isLoading: false,
            closeButton: true,
            render() {
              return 'Recevice files success';
            },
          });
        }
      } catch (error) {
        if (taostIdRef.current) {
          toast.update(taostIdRef.current, {
            type: 'error',
            isLoading: false,
            closeButton: true,
            render() {
              return 'Recevice files failed';
            },
          });
        }
      }
      taostIdRef.current = undefined;
    }
  });
}
