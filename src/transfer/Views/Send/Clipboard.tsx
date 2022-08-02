import {
  Label,
  Stack,
  PrimaryButton,
  DefaultButton,
  TextField,
} from '@fluentui/react';
import { TransferType } from 'const/Transfer';
import { useState } from 'react';
import { useServerAliveSse } from 'transfer/hooks';
import { getClipboard, sendClipboard } from 'transfer/requests';

const globalState: { text: string } = { text: '' };

interface ClipboardProps {
  disabled?: boolean;
}

export function Clipboard({ disabled = false }: ClipboardProps) {
  const [text, setText] = useState(globalState.text);
  useServerAliveSse(({ type, payload }) => {
    if (type === TransferType.sendClipboard) {
      setText(payload);
    }
    if (type === TransferType.getClipboard) {
      sendClipboard(text).catch();
    }
  });
  return (
    <Stack>
      <Label>Clipboard(Long press to paste or copy)</Label>
      <TextField
        value={text}
        onChange={(_, newValue) => {
          globalState.text = newValue!;
          setText(newValue!);
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
            if (data) setText(data);
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
          Send clipboard
        </PrimaryButton>
      </Stack>
    </Stack>
  );
}
