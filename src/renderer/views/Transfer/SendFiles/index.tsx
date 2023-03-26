import { useState } from 'react';
import { ipcRenderer, shell } from 'electron';
import { Button, Group, Input } from '@mantine/core';
import { IconClearAll, IconFolder, IconSend } from '@tabler/icons';
import fs from 'fs-extra';

import { ConfigCache } from 'caches';
import { IpcEvents } from 'const';
import { TransferType } from 'const/Transfer';

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
  const openDir = async () => {
    const dir = await ConfigCache.getTransferDir();
    shell.openPath(dir);
  };

  return (
    <Group position='right' spacing='sm'>
      <Input.Wrapper label='Transfer files' style={{ width: '100%' }}>
        {/* <MDropzone value={files} onChange={setFiles} /> */}
        <Dropzone value={files} onChange={setFiles} />
      </Input.Wrapper>
      <Group spacing='xs'>
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
        <Button
          variant='default'
          size='xs'
          leftIcon={<IconFolder size={14} />}
          onClick={openDir}
        >
          Open directory
        </Button>
      </Group>
    </Group>
  );
}
