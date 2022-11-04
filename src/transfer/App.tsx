import { useState } from 'react';
import { Alert, Stack } from '@mantine/core';

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
          <Alert color='green'>
            Connect to transfer server {server.serverName} success, can transfer
            files now.
          </Alert>
        ) : (
          <Alert color='red'>
            Can not get response from server, please wait or scan the qrcode
            again.
          </Alert>
        )}
        <Send disabled={!server} />
      </Stack>
    </serverContext.Provider>
  );
}
