import { useState } from 'react';
import { useAsync, useInterval } from 'react-use';
import { MantineProvider } from '@mantine/core';

import { BadanmuType, DanmuType } from 'const';

import { Danmu, DanmuList } from './Views/DanmuList';
import { useServerAliveSse } from './hooks';
import { deviceAlivePolling } from './requests';

import './App.scss';

const MAX_DANMU_NUM = 15;

function App() {
  const [list, setList] = useState<Danmu[]>([]);

  const polling = async () => {
    try {
      const { data } = await deviceAlivePolling();
    } catch (error) {
      console.error('Could not get response from server');
    }
  };
  useAsync(polling, []);
  useInterval(polling, 10000);

  function addDanmu(item: Danmu) {
    setList((prev) => [...prev.slice(1 - MAX_DANMU_NUM), item]);
  }

  useServerAliveSse(({ type, payload }) => {
    console.log(payload);
    switch (type) {
      case BadanmuType.connect:
        addDanmu({
          id: payload.uuid,
          type: DanmuType.system,
          content: `已成功连接至房间 ${payload.platform} - ${payload.roomId}`,
        });
        break;
      case BadanmuType.disconnect:
        addDanmu({
          id: payload.uuid,
          type: DanmuType.system,
          content: `已断开连接`,
        });
        break;
      case BadanmuType.message:
        switch (payload.type) {
          case DanmuType.comment:
            addDanmu({
              id: payload.uuid,
              type: DanmuType.comment,
              username: payload.playerName,
              content: payload.data,
            });
            break;
          case DanmuType.gift:
            addDanmu({
              id: payload.uuid,
              type: DanmuType.gift,
              username: payload.playerName,
              content: `${payload.giftName} x ${payload.num}`,
            });
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  });

  return <DanmuList data={list} />;
}

export default () => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  );
};
