import { useRef } from 'react';
import { Id, toast } from 'react-toastify';
import { saveByObjectUrl } from 'transfer/lib/saveFile';
import { getFile } from 'transfer/requests';
import { TransferType } from 'const/Transfer';
import { useServer } from './useServer';
import { useServerAliveSse } from './useServerAliveSse';

export function useReceiveFiles() {
  const server = useServer();

  const taostIdRef = useRef<Id>();

  const handleProgress = (event: any) => {
    if (taostIdRef.current) {
      const progress = event.loaded / event.total;
      toast.update(taostIdRef.current, {
        progress,
      });
    }
  };

  const downloadFileByAxios = async (file: { path: string }) => {
    const downloadFiles = async () => {
      const { path } = file;
      const name = path.replace(/^.*[\\/]/, '') || String(Date.now());
      const data = await getFile(path, handleProgress);
      saveByObjectUrl(data, name);
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
          autoClose: 3000,
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
          autoClose: 3000,
          render() {
            return 'Recevice files failed';
          },
        });
      }
    }
    taostIdRef.current = undefined;
  };

  useServerAliveSse(async ({ type, payload }) => {
    if (type === TransferType.sendFiles) {
      if (payload.length === 1) {
        downloadFileByAxios(payload[0]);
      }
    }
  });
}
