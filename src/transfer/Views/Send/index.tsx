import {
  Label,
  Stack,
  PrimaryButton,
  DefaultButton,
  Spinner,
} from '@fluentui/react';
import { useRef, useState } from 'react';
import { sendFiles } from 'transfer/requests';
import { useReceiveFiles, useServer } from 'transfer/hooks';
import { Id, toast } from 'react-toastify';
import { Dropzone } from './Dropzone';
import { Clipboard } from './Clipboard';

const globalState: { files: File[] } = { files: [] };

interface SendProps {
  disabled?: boolean;
}

export function Send({ disabled = false }: SendProps) {
  const [files, setStateFiles] = useState(globalState.files);
  const [loading, setLoading] = useState(false);
  const setFiles = (files: File[]) => {
    globalState.files = files;
    setStateFiles(files);
  };
  const toastIdRef = useRef<Id>();
  const server = useServer();
  const handleUploadProgress = (event: any) => {
    const progress = event.loaded / event.total;
    if (toastIdRef.current) {
      toast.update(toastIdRef.current, { progress });
    }
  };
  const handleSend = async () => {
    const form = new FormData();
    files.forEach((file) => {
      form.append('files', file);
    });
    setLoading(true);
    try {
      toastIdRef.current = toast(
        <>
          Update files to {server?.serverName}
          <br />
          Do not close this page before success
        </>,
        { progress: 0, closeButton: false }
      );
      await sendFiles(form, handleUploadProgress);
      if (toastIdRef.current) {
        toast.update(toastIdRef.current, {
          type: 'success',
          autoClose: 3000,
          closeButton: true,
        });
      }
    } catch (error) {
      if (toastIdRef.current) {
        toast.update(toastIdRef.current, {
          type: 'error',
          autoClose: 3000,
          closeButton: true,
        });
      }
    }
    toastIdRef.current = undefined;
    setLoading(false);
  };
  useReceiveFiles();
  return (
    <>
      {/* <Label styles={{ root: { fontSize: 24 } }}>Send</Label> */}
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
            {loading && <Spinner />}{' '}
            <DefaultButton
              disabled={files.length === 0 || loading}
              iconProps={{ iconName: 'Delete' }}
              onClick={() => setFiles([])}
            >
              Clear
            </DefaultButton>
            <PrimaryButton
              iconProps={{ iconName: 'Send' }}
              disabled={files.length === 0 || disabled || loading}
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
