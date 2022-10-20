import { useState } from 'react';
import { clipboard, ipcRenderer } from 'electron';

import { IpcEvents } from 'const';
import { TransferType } from 'const/Transfer';
import {
  DefaultButton,
  Label,
  PrimaryButton,
  Stack,
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
    <Stack>
      <Label>Text</Label>
      <Stack tokens={{ childrenGap: 12 }}>
        <TextField
          value={value}
          onChange={(_, newValue = '') => setValue(newValue)}
        />
        <Stack horizontal tokens={{ childrenGap: 12 }} horizontalAlign="end">
          <DefaultButton
            iconProps={{ iconName: 'download' }}
            onClick={handleGetClick}
          >
            Get text
          </DefaultButton>
          <PrimaryButton
            iconProps={{ iconName: 'send' }}
            onClick={handleSendClick}
          >
            Send {value.length > 0 ? 'text' : 'clipboard'}
          </PrimaryButton>
        </Stack>
      </Stack>
    </Stack>
  );
}
