import { useEffect, useState } from 'react';
import {
  MessageBar,
  MessageBarType,
  Pivot,
  PivotItem,
  Stack,
} from '@fluentui/react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAsync, useInterval } from 'react-use';
import { Send } from './Views/Send';
import { deviceAlivePolling, serverAliveSse } from './requests';
import './App.scss';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [server, setServer] = useState<{
    serverName: string;
    serverHost: string;
  }>();
  const handlePivotClick = (item?: PivotItem) => {
    navigate(item?.props.itemKey || '/');
  };
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
        <Pivot
          selectedKey={location.pathname}
          onLinkClick={handlePivotClick}
          styles={{ text: { fontSize: 18 }, count: { fontSize: 16 } }}
          // linkFormat="tabs"
        >
          <PivotItem headerText="Send" itemKey="/" />
          <PivotItem headerText="Receive" itemKey="/receive" />
        </Pivot>
        {server ? (
          <MessageBar messageBarType={MessageBarType.success}>
            Connect to transfer server {server.serverName} success, can transfer
            files now.
          </MessageBar>
        ) : (
          <MessageBar messageBarType={MessageBarType.error}>
            Can not get response from server, please wait or scan the qrcode
            again.
          </MessageBar>
        )}
        <Routes>
          <Route path="/" element={<Send disabled={!!server} />} />
        </Routes>
      </Stack>
    </Stack>
  );
}
