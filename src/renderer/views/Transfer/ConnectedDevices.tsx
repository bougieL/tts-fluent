import { Fragment, useState } from 'react';
import fs from 'fs-extra';

import { TransferCache } from 'caches/transfer';
import {
  ActivityItem,
  FStack,
  FText,
  Icon,
  Label,
  Separator,
} from 'renderer/components';
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
    <FStack>
      <Label>Connected devices</Label>
      <FStack
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
            <Fragment key={item.deviceId}>
              <ActivityItem
                activityIcon={<Icon iconName="Devices3" />}
                activityDescription={item.deviceId}
                comments={<FText>{item.deviceName}</FText>}
                timeStamp={item.deviceHost}
                styles={{
                  root: {
                    width: 250,
                  },
                }}
              />
              <Separator />
            </Fragment>
          );
        })}
      </FStack>
    </FStack>
  );
}
