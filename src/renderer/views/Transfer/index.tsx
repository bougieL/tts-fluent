import { FC } from 'react';
import { Stack } from '@mantine/core';

import { Clipboard } from './Clipboard';
import { ConnectedDevices } from './ConnectedDevices';
import { HostServer } from './HostServer';
import { SendFiles } from './SendFiles';

const Transfer: FC = () => {
  return (
    <HostServer
      bottomSlot={<ConnectedDevices />}
      rightSlot={
        <Stack spacing='sm' style={{ flex: 1, height: '100%' }}>
          <SendFiles />
          <Clipboard />
        </Stack>
      }
    />
  );
};

Transfer.displayName = 'Transfer';

export default Transfer;
