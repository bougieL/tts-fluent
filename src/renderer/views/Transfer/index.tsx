import { Stack } from '@fluentui/react';
import { ConnectedDevices } from './ConnectedDevices';
import { HostServer } from './HostServer';
import { SendFiles } from './SendFiles';
import { Clipboard } from './Clipboard';

export function Transfer() {
  return (
    <Stack horizontal tokens={{ childrenGap: 12 }}>
      <HostServer
        bottomSlot={<ConnectedDevices />}
        rightSlot={
          <Stack tokens={{ childrenGap: 36 }}>
            <SendFiles />
            <Clipboard />
          </Stack>
        }
      />
    </Stack>
  );
}
