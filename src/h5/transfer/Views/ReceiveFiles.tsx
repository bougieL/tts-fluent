import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Anchor,
  Divider,
  Group,
  Input,
  List,
  Stack,
  Text,
} from '@mantine/core';
import { IconDownload } from '@tabler/icons';
import { useReceiveFiles, useServer } from 'h5/Transfer/hooks';

import { humanFileSize } from 'lib/humanFileSize';

export function ReceiveFiles() {
  const server = useServer();

  const [files, setFiles] = useState<
    Array<{ name: string; download: string; size: number }>
  >([]);

  useReceiveFiles({
    onReceiveManualFiles(files) {
      toast.info(
        <Stack spacing='xs'>
          <Text>Receive files from {server?.serverName}</Text>
          <Text size='sm'>
            {files.length === 1
              ? 'Your browser doesn‘t support auto download'
              : 'Doesn‘t support auto download multi files'}
            , please download manually
          </Text>
        </Stack>,
        {
          autoClose: false,
        }
      );
      setFiles(files);
    },
  });

  if (files.length === 0) {
    return null;
  }

  return (
    <Stack spacing='xs'>
      <Group position='apart'>
        <Text size='sm'>Receive files</Text>
        <Anchor
          style={{ fontSize: 14 }}
          onClick={() => {
            setFiles([]);
          }}
        >
          Clear
        </Anchor>
      </Group>
      <List
        spacing='xs'
        listStyleType='none'
        styles={{
          itemWrapper: {
            width: '100%',
          },
        }}
      >
        {files.map((item) => {
          return (
            <List.Item key={item.download}>
              <Anchor download={item!.name} href={item!.download}>
                <Group position='apart'>
                  <Text size='sm'>{item!.name}</Text>
                  <Group position='right' spacing='sm'>
                    <Text size='sm' style={{ whiteSpace: 'nowrap' }}>
                      {humanFileSize(item!.size)}
                    </Text>
                    <IconDownload size={14} />
                  </Group>
                </Group>
              </Anchor>
            </List.Item>
          );
        })}
      </List>
    </Stack>
  );
}
