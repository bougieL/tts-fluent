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

import { humanFileSize } from 'lib/humanFileSize';
import { useReceiveFiles, useServer } from 'transfer/hooks';

export function ReceiveFiles() {
  const server = useServer();

  const [files, setFiles] = useState<
    Array<{ name: string; download: string; size: number }>
  >([]);

  useReceiveFiles({
    onReceiveManualFiles(files) {
      toast.info(
        <>
          <Text>Receive files from {server?.serverName}</Text>
          <br />
          <Text size='sm'>
            {files.length === 1
              ? 'Your browser doesn‘t support auto download'
              : 'Doesn‘t support auto download multi files'}
            , please download manually
          </Text>
        </>,
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
    <Stack>
      <Group position='apart'>
        <Text>Receive files</Text>
        <Anchor
          style={{ fontSize: 14 }}
          onClick={() => {
            setFiles([]);
          }}
        >
          Clear
        </Anchor>
      </Group>
      <List>
        {files.map((item) => {
          return (
            <Fragment key={item.download}>
              <Anchor download={item!.name} href={item!.download}>
                <Group position='apart' spacing='sm'>
                  <Text size='sm'>{item!.name}</Text>
                  <Group position='right' spacing='sm'>
                    <Text size='sm' style={{ whiteSpace: 'nowrap' }}>
                      {humanFileSize(item!.size)}
                    </Text>
                    <IconDownload />
                  </Group>
                </Group>
              </Anchor>
              <Divider />
            </Fragment>
          );
        })}
      </List>
    </Stack>
  );
}
