import { DefaultButton, Label, PrimaryButton, Stack } from '@fluentui/react';
import { IpcEvents } from 'const';
import { TransferType } from 'const/Transfer';
import { ipcRenderer } from 'electron';
import { useState } from 'react';
import { Dropzone, File } from './Dropzone';

const globalState: {
  files: File[];
} = {
  files: [],
};

export function SendFiles() {
  const [files, setStateFiles] = useState(globalState.files);
  const setFiles = (files: File[]) => {
    setStateFiles(files);
    globalState.files = files;
  };
  const sendFiles = () => {
    // console.log('files', files);
    ipcRenderer.send(IpcEvents.transferSSEData, {
      type: TransferType.sendFiles,
      payload: files.map((item) => {
        return {
          path: item.path,
        };
      }),
    });
  };
  return (
    <Stack horizontal>
      <Stack horizontalAlign="end" tokens={{ childrenGap: 12 }}>
        <Stack>
          <Label>Transfer files</Label>
          <Dropzone value={files} onChange={setFiles} />
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 12 }}>
          <DefaultButton
            iconProps={{ iconName: 'delete' }}
            disabled={files.length === 0}
            onClick={() => setFiles([])}
          >
            Clear Files
          </DefaultButton>
          <PrimaryButton
            iconProps={{ iconName: 'send' }}
            disabled={files.length === 0}
            onClick={sendFiles}
          >
            Send Files
          </PrimaryButton>
        </Stack>
      </Stack>
    </Stack>
  );
}
