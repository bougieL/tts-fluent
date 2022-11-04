import { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconDownload, IconSend } from '@tabler/icons';
import copy from 'copy-to-clipboard';

import { TransferType } from 'const/Transfer';
import { useServer, useServerAliveSse } from 'transfer/hooks';
import { getClipboard, sendClipboard } from 'transfer/requests';

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
      <TextInput
        label='Text'
        value={text}
        onChange={(event) => {
          setText(event.target.value);
        }}
      />
      <Group styles={{ root: { paddingTop: 12 } }} spacing={12}>
        <Button
          variant='default'
          leftIcon={<IconDownload />}
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
          }}
        >
          Get clipboard
        </Button>
        <Button
          leftIcon={<IconSend />}
          disabled={!text || disabled}
          onClick={() => {
            sendClipboard(text);
          }}
        >
          Send text
        </Button>
      </Group>
    </Stack>
  );
}
