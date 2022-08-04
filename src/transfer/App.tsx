import { useState } from 'react';
import { MessageBar, MessageBarType, Stack } from '@fluentui/react';
import { useAsync, useInterval } from 'react-use';
import { Send } from './Views/Send';
import { Receive } from './Views/Receive';
import { deviceAlivePolling } from './requests';
import { useReceiveFiles, serverContext } from './hooks';
import './App.scss';

export function App() {
  const [server, setServer] = useState<{
    serverName: string;
    serverHost: string;
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
      <Stack horizontalAlign="center" styles={{ root: { padding: 12 } }}>
        <Stack
          tokens={{ childrenGap: 12 }}
          styles={{
            root: {
              width: 500,
              '@media (max-width: 500px)': {
                width: '100%',
              },
            },
          }}
        >
          {server ? (
            <MessageBar messageBarType={MessageBarType.success}>
              Connect to transfer server {server.serverName} success, can
              transfer files now.
            </MessageBar>
          ) : (
            <MessageBar messageBarType={MessageBarType.error}>
              Can not get response from server, please wait or scan the qrcode
              again.
            </MessageBar>
          )}
          {/* <Receive /> */}
          <Send disabled={!server} />
        </Stack>
      </Stack>
    </serverContext.Provider>
  );
}
