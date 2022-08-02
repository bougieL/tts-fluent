import { Stack } from '@fluentui/react';
import { ConnectedDevices } from './ConnectedDevices';
import { HostServer } from './HostServer';
import { SendFiles } from './SendFiles';
import { Clipboard } from './Clipboard';

export function Transfer() {
  return (
    <Stack tokens={{ childrenGap: 12 }}>
      <Stack horizontal>
        <HostServer slot={<ConnectedDevices />} />
      </Stack>
      <Stack horizontal tokens={{ childrenGap: 12 }}>
        <SendFiles />
        <Clipboard />
      </Stack>
    </Stack>
  );
}
