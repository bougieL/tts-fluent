import { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconDownload, IconSend } from '@tabler/icons';
import copy from 'copy-to-clipboard';
import { useServer, useServerAliveSse } from 'h5/transfer/hooks';
import { getClipboard, sendClipboard } from 'h5/transfer/requests';

import { TransferType } from 'const/Transfer';

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
      <Group spacing='sm' position='right'>
        <Button
          size='xs'
          variant='default'
          leftIcon={<IconDownload size={16} />}
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
          size='xs'
          leftIcon={<IconSend size={16} />}
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
