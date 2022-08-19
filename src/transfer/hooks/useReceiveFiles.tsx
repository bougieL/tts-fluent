import { Id, toast } from 'react-toastify';
import { Text } from 'transfer/components';
import { saveByObjectUrl } from 'transfer/lib/saveFile';
import { getFile, getFileDownloadUrl } from 'transfer/requests';
import { TransferType } from 'const/Transfer';
import { detectMobile } from 'transfer/lib/detectMobile';
import { useServer } from './useServer';
import { useServerAliveSse } from './useServerAliveSse';

function getFilenameByPath(p: string) {
  return p.replace(/^.*[\\/]/, '') || String(Date.now());
}

interface Options {
  onReceiveManualFiles?: (
    files: Array<{ name: string; download: string; size: number }>
  ) => void;
}

export function useReceiveFiles(options?: Options) {
  const server = useServer();

  const handleProgress = (event: any, id: Id) => {
    const progress = event.loaded / event.total;
    toast.update(id, {
      progress,
    });
  };

  const downloadFileByAxios = async (file: { path: string }) => {
    const id = toast.loading(
      <>
        <Text>Receiving files from {server?.serverName}</Text>
        <br />
        <Text variant="small">Do not close this page before success</Text>
      </>,
      { progress: 0, closeButton: false, closeOnClick: false, autoClose: false }
    );

    const downloadFiles = async () => {
      const { path } = file;
      const name = getFilenameByPath(path);
      const data = await getFile(path, (event) => handleProgress(event, id));
      saveByObjectUrl(data, name);
    };
    try {
      await downloadFiles();
      toast.update(id, {
        type: 'success',
        isLoading: false,
        closeButton: true,
        closeOnClick: true,
        autoClose: 3000,
        render() {
          return <Text>Recevice files success 😄</Text>;
        },
      });
    } catch (error) {
      toast.update(id, {
        type: 'error',
        isLoading: false,
        closeButton: true,
        closeOnClick: true,
        autoClose: 3000,
        render() {
          return <Text>Recevice files failed 🤡</Text>;
        },
      });
    }
  };

  useServerAliveSse(async ({ type, payload }) => {
    if (type === TransferType.sendFiles) {
      if (payload.length === 1 && !detectMobile()) {
        downloadFileByAxios(payload[0]);
      } else {
        options?.onReceiveManualFiles?.(
          payload.map(({ path, size }: any) => ({
            name: getFilenameByPath(path),
            download: getFileDownloadUrl(path),
            size,
          }))
        );
      }
    }
  });
}
