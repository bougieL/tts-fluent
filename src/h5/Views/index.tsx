import { useState } from 'react';
import { Id, toast } from 'react-toastify';
import { Button, Group, Input, Stack, Text } from '@mantine/core';
import { IconSend, IconTrash } from '@tabler/icons';
import { useServer } from 'h5/hooks';
import { sendFiles } from 'h5/requests';

import { Clipboard } from './Clipboard';
import { Dropzone } from './Dropzone';
import { ReceiveFiles } from './ReceiveFiles';

interface SendProps {
  disabled?: boolean;
}

export function Send({ disabled = false }: SendProps) {
  const [files, setFiles] = useState<File[]>([]);

  const server = useServer();
  const handleUploadProgress = (event: any, id: Id) => {
    const progress = event.loaded / event.total;
    toast.update(id, { progress });
  };
  const handleSend = async () => {
    const form = new FormData();
    files.forEach((file) => {
      form.append('files', file);
    });
    const id = toast.loading(
      <Stack spacing='xs'>
        <Text>Upload files to {server?.serverName}</Text>
        <Text size='sm'>Do not close this page before success</Text>
      </Stack>,
      { progress: 0, closeButton: false, closeOnClick: false, autoClose: false }
    );
    try {
      await sendFiles(form, (event) => handleUploadProgress(event, id));
      toast.update(id, {
        type: 'success',
        isLoading: false,
        closeButton: true,
        closeOnClick: true,
        autoClose: 3000,
        render() {
          return <Text>Upload success 😄</Text>;
        },
      });
    } catch (error) {
      toast.update(id, {
        type: 'error',
        isLoading: false,
        closeButton: true,
        closeOnClick: true,
        autoClose: 3000,
        render() {
          return <Text>Upload failed 🤡</Text>;
        },
      });
    }
  };

  return (
    <>
      <ReceiveFiles />
      <Stack spacing='lg'>
        <Stack>
          <Input.Wrapper label='Files'>
            <Dropzone value={files} onChange={setFiles} />
          </Input.Wrapper>
          <Group spacing='sm' position='right'>
            <Button
              size='xs'
              disabled={files.length === 0}
              leftIcon={<IconTrash size={16} />}
              onClick={() => setFiles([])}
            >
              Clear
            </Button>
            <Button
              size='xs'
              leftIcon={<IconSend size={16} />}
              disabled={files.length === 0 || disabled}
              onClick={handleSend}
            >
              Send files
            </Button>
          </Group>
        </Stack>
        <Clipboard />
      </Stack>
    </>
  );
}
