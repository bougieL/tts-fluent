import {
  Label,
  Stack,
  PrimaryButton,
  DefaultButton,
  Text,
} from 'transfer/components';
import { useState } from 'react';
import { sendFiles } from 'transfer/requests';
import { useServer } from 'transfer/hooks';
import { Id, toast } from 'react-toastify';
import { Dropzone } from './Dropzone';
import { Clipboard } from './Clipboard';
import { ReceiveFiles } from './ReceiveFiles';

interface SendProps {
  disabled?: boolean;
}

export function Send({ disabled = false }: SendProps) {
  const [files, setFiles] = useState<File[]>([]);

  const server = useServer();
  const handleUploadProgress = (event: any, id: Id) => {
    const progress = event.loaded / event.total;
    toast.update(id, { progress });
  };
  const handleSend = async () => {
    const form = new FormData();
    files.forEach((file) => {
      form.append('files', file);
    });
    const id = toast.loading(
      <>
        <Text>Upload files to {server?.serverName}</Text>
        <br />
        <Text variant="small">Do not close this page before success</Text>
      </>,
      { progress: 0, closeButton: false, closeOnClick: false, autoClose: false }
    );
    try {
      await sendFiles(form, (event) => handleUploadProgress(event, id));
      toast.update(id, {
        type: 'success',
        isLoading: false,
        closeButton: true,
        closeOnClick: true,
        autoClose: 3000,
        render() {
          return <Text>Upload success 😄</Text>;
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
          return <Text>Upload failed 🤡</Text>;
        },
      });
    }
  };

  return (
    <>
      <ReceiveFiles />
      <Stack tokens={{ childrenGap: 24 }}>
        <Stack>
          <Label>Files</Label>
          <Dropzone value={files} onChange={setFiles} />
          <Stack
            horizontalAlign="end"
            horizontal
            styles={{ root: { paddingTop: 12 } }}
            tokens={{ childrenGap: 12 }}
          >
            <DefaultButton
              disabled={files.length === 0}
              iconProps={{ iconName: 'Delete' }}
              onClick={() => setFiles([])}
            >
              Clear
            </DefaultButton>
            <PrimaryButton
              iconProps={{ iconName: 'Send' }}
              disabled={files.length === 0 || disabled}
              onClick={handleSend}
            >
              Send files
            </PrimaryButton>
          </Stack>
        </Stack>
        <Clipboard />
      </Stack>
    </>
  );
}
