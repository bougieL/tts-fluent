import { useState } from 'react';
import { useAsync, useInterval } from 'react-use';
import { MantineProvider } from '@mantine/core';

import { BadanmuState, BadanmuType } from 'const';

import { Danmu, DanmuList } from './Views/DanmuList';
import { useServerAliveSse } from './hooks';
import { deviceAlivePolling } from './requests';

import './App.scss';

const MAX_DANMU_NUM = 15;

function App() {
  const [danmuList, setDanmuList] = useState<Danmu[]>([]);

  function addDanmu(item: Danmu) {
    setDanmuList((prev) => [...prev.slice(1 - MAX_DANMU_NUM), item]);
  }

  const polling = async () => {
    try {
      const { data } = await deviceAlivePolling();
      if (data.state === BadanmuState.disconnected) {
        addDanmu({
          id: data.uuid,
          type: BadanmuType.disconnectUnexpect,
          content: `未连接至房间`,
        });
      }
    } catch (error) {
      console.error('Could not get response from server');
    }
  };
  useAsync(polling, []);
  useInterval(polling, 10000);

  useServerAliveSse(({ type, payload }) => {
    console.log({ type, payload });
    switch (type) {
      case BadanmuType.connect:
        addDanmu({
          id: payload.uuid,
          type: BadanmuType.connect,
          content: `已成功连接至房间 ${payload.platform} - ${payload.roomId}`,
        });
        break;
      case BadanmuType.disconnectUnexpect:
        addDanmu({
          id: payload.uuid,
          type: BadanmuType.disconnectUnexpect,
          content: `发生错误，已断开连接（${payload.data}）`,
        });
        break;
      case BadanmuType.disconnectManually:
        addDanmu({
          id: payload.uuid,
          type: BadanmuType.disconnectManually,
          content: `已主动断开连接`,
        });
        break;
      case BadanmuType.error:
        addDanmu({
          id: payload.uuid,
          type: BadanmuType.error,
          content: `发生错误 ${payload.data}`,
        });
        break;
      case BadanmuType.comment:
        addDanmu({
          id: payload.uuid,
          type: BadanmuType.comment,
          username: payload.playerName,
          content: payload.data,
          avatar: payload.avatar,
        });
        break;
      case BadanmuType.gift:
        addDanmu({
          id: payload.uuid,
          type: BadanmuType.gift,
          username: payload.playerName,
          content: `赠送 ${payload.giftName} x ${payload.num}`,
          avatar: payload.avatar,
        });
        break;
      case BadanmuType.enter:
        addDanmu({
          id: payload.uuid,
          type: BadanmuType.enter,
          username: payload.playerName,
          content: '进入直播间',
        });
        break;
      case BadanmuType.follow:
        addDanmu({
          id: payload.uuid,
          type: BadanmuType.follow,
          username: payload.playerName,
          content: '关注直播间',
        });
        break;
      default:
        break;
    }
  });
  return <DanmuList data={danmuList} />;
}

export default () => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  );
};
