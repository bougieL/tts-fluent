import { useState } from 'react';
import { ipcRenderer } from 'electron';
import fs from 'fs-extra';

import { IpcEvents } from 'const';
import { TransferType } from 'const/Transfer';
import {
  Button,
  FStack,
  IconClearAll,
  IconSend,
  Label,
} from 'renderer/components';

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
          size: fs.statSync(item.path).size,
        };
      }),
    });
  };
  return (
    <FStack horizontal>
      <FStack horizontalAlign='end' tokens={{ childrenGap: 12 }}>
        <FStack>
          <Label>Transfer files</Label>
          <Dropzone value={files} onChange={setFiles} />
        </FStack>
        <FStack horizontal tokens={{ childrenGap: 12 }}>
          <Button
            variant='default'
            size='xs'
            leftIcon={<IconClearAll size={14} />}
            disabled={files.length === 0}
            onClick={() => setFiles([])}
          >
            Clear Files
          </Button>
          <Button
            variant='default'
            size='xs'
            leftIcon={<IconSend size={14} />}
            disabled={files.length === 0}
            onClick={sendFiles}
          >
            Send Files
          </Button>
        </FStack>
      </FStack>
    </FStack>
  );
}
