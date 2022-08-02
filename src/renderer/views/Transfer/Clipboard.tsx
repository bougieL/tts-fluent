import { DefaultButton, Label, PrimaryButton, Stack } from '@fluentui/react';
import { IpcEvents } from 'const';
import { TransferType } from 'const/Transfer';
import { clipboard, ipcRenderer } from 'electron';

export function Clipboard() {
  const handleSendClick = () => {
    const text = clipboard.readText();
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
      <Label>Clipboard</Label>
      <Stack horizontal tokens={{ childrenGap: 12 }}>
        <DefaultButton
          iconProps={{ iconName: 'download' }}
          onClick={handleGetClick}
        >
          Get clipboard
        </DefaultButton>
        <PrimaryButton
          iconProps={{ iconName: 'send' }}
          onClick={handleSendClick}
        >
          Send clipboard
        </PrimaryButton>
      </Stack>
    </Stack>
  );
}
