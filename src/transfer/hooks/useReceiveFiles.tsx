import { TransferType } from 'const/Transfer';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';
import { saveByObjectUrl } from 'transfer/lib/saveFile';
import { fetchFile } from 'transfer/requests';
import { useServer } from './useServer';
import { useServerAliveSse } from './useServerAliveSse';

export function useReceiveFiles() {
  const server = useServer();
  useServerAliveSse(({ type, payload }) => {
    if (type === TransferType.sendFiles) {
      const downloadFiles = async () => {
        // eslint-disable-next-line no-restricted-syntax
        for (const { path } of payload) {
          const name = path.split('/').pop() || String(Date.now());
          // eslint-disable-next-line no-await-in-loop
          const data = await fetchFile(path);
          saveByObjectUrl(data, name);
        }
      };
      toast.promise(downloadFiles, {
        pending: {
          render() {
            return (
              <>
                Receiving files from {server?.serverName}
                <br />
                Do not close this page before success
              </>
            );
          },
        },
        success: {
          render() {
            return 'Recevice files success';
          },
        },
        error: {
          render() {
            return 'Receive files failed';
          },
        },
      });
    }
  });
}
