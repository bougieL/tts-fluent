import { Stack } from 'renderer/components';

import { Clipboard } from './Clipboard';
import { ConnectedDevices } from './ConnectedDevices';
import { HostServer } from './HostServer';
import { SendFiles } from './SendFiles';

function Transfer() {
  return (
    <Stack horizontal tokens={{ childrenGap: 12 }}>
      <HostServer
        bottomSlot={<ConnectedDevices />}
        rightSlot={
          <Stack tokens={{ childrenGap: 12 }}>
            <SendFiles />
            <Clipboard />
          </Stack>
        }
      />
    </Stack>
  );
}

export default Transfer;
