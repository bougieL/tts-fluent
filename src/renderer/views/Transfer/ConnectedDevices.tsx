import { useState } from 'react';
import { useAsync } from 'react-use';
import { Input, List, Stack, Text } from '@mantine/core';
import { IconDevices2 } from '@tabler/icons';
import fs from 'fs-extra';

import { TransferCache } from 'caches';

export function ConnectedDevices() {
  const [devices, setDevices] = useState<TransferCache.Device[]>([]);
  useAsync(async () => {
    const updater = async () => {
      const c = await TransferCache.getConnectedDevices();
      setDevices(c);
    };
    const p = await TransferCache.getConnectedDevicesPath();
    updater();
    fs.watch(p, updater);
  }, []);
  return (
    <Input.Wrapper label='Connected devices'>
      <List
        styles={{
          // @ts-ignore
          root: {
            flex: 1,
            maxHeight: 'calc(100vh - 470px)',
            overflow: 'overlay',
            overflowX: 'hidden',
            width: 250,
          },
        }}
      >
        {devices.filter(Boolean).map((item) => {
          return (
            <List.Item icon={<IconDevices2 size={16} />}>
              <Stack spacing={0}>
                <Text size='sm'>{item.deviceName}</Text>
                <Text size='xs' color='dimmed'>
                  {item.deviceHost}
                </Text>
                <Text size='xs' color='dimmed'>
                  {item.deviceId}
                </Text>
              </Stack>
            </List.Item>
          );
        })}
      </List>
    </Input.Wrapper>
  );
}
