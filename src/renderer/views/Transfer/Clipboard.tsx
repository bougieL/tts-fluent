import { useState } from 'react';
import { clipboard, ipcRenderer } from 'electron';

import { IpcEvents } from 'const';
import { TransferType } from 'const/Transfer';
import {
  Button,
  Group,
  IconDownload,
  IconSend,
  Input,
  Space,
  TextField,
} from 'renderer/components';

export function Clipboard() {
  const [value, setValue] = useState('');

  const handleSendClick = () => {
    const text = value || clipboard.readText();
    if (text) {
      ipcRenderer.send(IpcEvents.transferSSEData, {
        type: TransferType.sendClipboard,
        payload: text,
      });
    }
  };
  const handleGetClick = () => {
    ipcRenderer.send(IpcEvents.transferSSEData, {
      type: TransferType.getClipboard,
    });
  };
  return (
    <Input.Wrapper label='Text'>
      <TextField
        value={value}
        onChange={(_, newValue = '') => setValue(newValue)}
      />
      <Space h='sm' />
      <Group spacing='sm' position='right'>
        <Button
          leftIcon={<IconDownload size={14} />}
          variant='default'
          size='xs'
          onClick={handleGetClick}
        >
          Get text
        </Button>
        <Button
          leftIcon={<IconSend size={14} />}
          variant='default'
          size='xs'
          onClick={handleSendClick}
        >
          Send {value.length > 0 ? 'text' : 'clipboard'}
        </Button>
      </Group>
    </Input.Wrapper>
  );
}
