import {
  ActivityItem,
  Icon,
  Label,
  Separator,
  Stack,
  Text,
} from '@fluentui/react';
import { TransferCache } from 'caches/transfer';
import fs from 'fs-extra';
import { Fragment, useState } from 'react';
import { useAsync } from 'renderer/hooks';

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
    <Stack
      styles={{
        root: {
          flex: 1,
          maxHeight: 'calc(100vh - 515px)',
          overflow: 'auto',
          overflowX: 'hidden',
        },
      }}
    >
      <Label>Connected devices</Label>
      {devices.filter(Boolean).map((item) => {
        return (
          <Fragment key={item.deviceId}>
            <ActivityItem
              activityIcon={<Icon iconName="Devices3" />}
              activityDescription={item.deviceId}
              comments={<Text>{item.deviceName}</Text>}
              timeStamp={item.deviceHost}
              styles={{
                root: {
                  width: 300,
                },
              }}
            />
            <Separator />
          </Fragment>
        );
      })}
    </Stack>
  );
}
