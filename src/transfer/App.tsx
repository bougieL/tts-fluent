import { useState } from 'react';
import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons';

import { serverContext, useAsync, useInterval } from './hooks';
import { deviceAlivePolling } from './requests';
import { Send } from './Views';

import './App.scss';

export function App() {
  const [server, setServer] = useState<{
    serverName: string;
    serverOrigin: string;
  }>();
  const polling = async () => {
    try {
      const { data } = await deviceAlivePolling();
      setServer(data);
    } catch (error) {
      setServer(undefined);
    }
  };
  useAsync(polling, []);
  useInterval(polling, 5000);
  return (
    <serverContext.Provider value={server}>
      <Stack spacing='md'>
        {server ? (
          <Alert color='green' icon={<IconCircleCheck />} p='6px 12px'>
            <Text size='xs'>
              Connect to transfer server {server.serverName} success, can
              transfer files now.
            </Text>
          </Alert>
        ) : (
          <Alert color='red' icon={<IconAlertCircle />}>
            Can not get response from server, please wait or scan the qrcode
            again.
          </Alert>
        )}
        <Send disabled={!server} />
      </Stack>
    </serverContext.Provider>
  );
}
