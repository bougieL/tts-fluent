import { FC } from 'react';

import { FStack } from 'renderer/components';

import { Clipboard } from './Clipboard';
import { ConnectedDevices } from './ConnectedDevices';
import { HostServer } from './HostServer';
import { SendFiles } from './SendFiles';

const Transfer: FC = () => {
  return (
    <FStack horizontal tokens={{ childrenGap: 12 }}>
      <HostServer
        bottomSlot={<ConnectedDevices />}
        rightSlot={
          <FStack tokens={{ childrenGap: 12 }}>
            <SendFiles />
            <Clipboard />
          </FStack>
        }
      />
    </FStack>
  );
};

Transfer.displayName = 'Transfer';

export default Transfer;
