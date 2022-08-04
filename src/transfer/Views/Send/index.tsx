import {
  Label,
  Stack,
  PrimaryButton,
  DefaultButton,
  Spinner,
} from '@fluentui/react';
import { useState } from 'react';
import { sendFiles } from 'transfer/requests';
import { useReceiveFiles } from 'transfer/hooks';
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
  const handleSend = async () => {
    const form = new FormData();
    files.forEach((file) => {
      form.append('files', file);
    });
    setLoading(true);
    await sendFiles(form).catch();
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
            {loading && <Spinner />}
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
