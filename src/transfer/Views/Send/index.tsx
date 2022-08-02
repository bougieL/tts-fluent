import { Label, Stack, PrimaryButton, DefaultButton } from '@fluentui/react';
import { useState } from 'react';
import { Dropzone } from './Dropzone';
import { Clipboard } from './Clipboard';

const globalState: { files: File[] } = { files: [] };

interface SendProps {
  disabled?: boolean;
}

export function Send({ disabled = false }: SendProps) {
  const [files, setStateFiles] = useState(globalState.files);
  const setFiles = (files: File[]) => {
    globalState.files = files;
    setStateFiles(files);
  };
  return (
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
          >
            Send files
          </PrimaryButton>
        </Stack>
      </Stack>
      <Clipboard />
    </Stack>
  );
}
