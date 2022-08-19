import {
  Label,
  Stack,
  PrimaryButton,
  DefaultButton,
  TextField,
  Text,
} from 'transfer/components';
import { TransferType } from 'const/Transfer';
import { useState } from 'react';
import copy from 'copy-to-clipboard';
import { useServer, useServerAliveSse } from 'transfer/hooks';
import { getClipboard, sendClipboard } from 'transfer/requests';
import { toast } from 'react-toastify';

interface ClipboardProps {
  disabled?: boolean;
}

export function Clipboard({ disabled = false }: ClipboardProps) {
  const [text, setText] = useState('');
  const server = useServer();
  useServerAliveSse(({ type, payload }) => {
    if (type === TransferType.sendClipboard) {
      setText(payload);
      copy(payload);
      toast.success(<Text>Get clipboard from {server?.serverName}</Text>);
    }
    if (type === TransferType.getClipboard) {
      sendClipboard(text).catch();
    }
  });
  return (
    <Stack>
      <Label>Text</Label>
      <TextField
        value={text}
        onChange={(_, newValue = '') => {
          setText(newValue);
        }}
      />
      <Stack
        horizontalAlign="end"
        horizontal
        styles={{ root: { paddingTop: 12 } }}
        tokens={{ childrenGap: 12 }}
      >
        <DefaultButton
          iconProps={{ iconName: 'Download' }}
          disabled={disabled}
          onClick={async () => {
            const { data } = await getClipboard().catch();
            if (data) {
              setText(data);
              copy(data);
              toast.success(
                <Text>Get clipboard from {server?.serverName}</Text>
              );
            }
            // copy(text);
          }}
        >
          Get clipboard
        </DefaultButton>
        <PrimaryButton
          iconProps={{ iconName: 'Send' }}
          disabled={!text || disabled}
          onClick={async () => {
            await sendClipboard(text).catch();
          }}
        >
          Send text
        </PrimaryButton>
      </Stack>
    </Stack>
  );
}
