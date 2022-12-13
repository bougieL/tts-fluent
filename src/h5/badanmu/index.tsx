import { useRef } from 'react';
import { useAsync, useInterval, useSearchParam } from 'react-use';
import { Stack } from '@mantine/core';

import { BadanmuState, BadanmuType } from 'const';

import { SpeakQueue } from './requests/SpeakQueue';
import { Danmu, DanmuList, DanmuListHandle } from './Views/DanmuList';
import { TextCarousel, TextCarouselHandle } from './Views/TextCarousel';
import { useServerAliveSse } from './hooks';
import { deviceAlivePolling } from './requests';

import './style.scss';

function BadanmuApp() {
  const danmuListRef = useRef<DanmuListHandle>(null);
  const textCarouselRef = useRef<TextCarouselHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showBackground = useSearchParam('background');
  const speakDanmu = useSearchParam('speak');
  const aiChat = !!useSearchParam('aiChat');
  const speakQueue = useRef(new SpeakQueue({ aiChat })).current;

  function addDanmu(item: Danmu, speakText?: string) {
    danmuListRef.current?.addItem(item);
    if (speakDanmu && speakText) {
      speakQueue.add(speakText);
    }
  }

  const polling = async () => {
    try {
      const { data } = await deviceAlivePolling();
      if (data.state === BadanmuState.disconnected) {
        addDanmu(
          {
            id: data.uuid,
            type: BadanmuType.disconnectUnexpect,
            content: `未连接至房间`,
          },
          `未连接至房间`
        );
      }
    } catch (error) {
      console.error('Could not get response from server');
    }
  };
  useAsync(polling, []);
  useInterval(polling, 10000);

  useServerAliveSse(({ type, payload }) => {
    // console.log({ type, payload });
    switch (type) {
      case BadanmuType.connect:
        addDanmu(
          {
            id: payload.uuid,
            type: BadanmuType.connect,
            content: `已成功连接至房间 ${payload.platform} - ${payload.roomId}`,
          },
          `已成功连接至房间 ${payload.platform} - ${payload.roomId}`
        );
        break;
      case BadanmuType.disconnectUnexpect:
        addDanmu(
          {
            id: payload.uuid,
            type: BadanmuType.disconnectUnexpect,
            content: `发生错误，已断开连接（${payload.data}）`,
          },
          `发生错误，已断开连接（${payload.data}）`
        );
        break;
      case BadanmuType.disconnectManually:
        addDanmu(
          {
            id: payload.uuid,
            type: BadanmuType.disconnectManually,
            content: `已主动断开连接`,
          },
          `已主动断开连接`
        );
        break;
      case BadanmuType.error:
        addDanmu(
          {
            id: payload.uuid,
            type: BadanmuType.error,
            content: `发生错误 ${payload.data}`,
          },
          `发生错误 ${payload.data}`
        );
        break;
      case BadanmuType.comment:
        addDanmu(
          {
            id: payload.uuid,
            type: BadanmuType.comment,
            username: payload.playerName,
            content: payload.data,
            avatar:
              'https://i0.hdslb.com/bfs/article/2982bc4a8ac568c61f9e6b54ed2a0ad350bd07aa.jpg',
            image: payload.image,
          },
          `${payload.playerName}说: ${payload.data}`
        );
        break;
      case BadanmuType.gift:
        addDanmu(
          {
            id: payload.uuid,
            type: BadanmuType.gift,
            username: payload.playerName,
            content: `赠送 ${payload.giftName} x ${payload.num}`,
            avatar: payload.avatar,
          },
          `感谢${payload.playerName}赠送的${payload.num}个${payload.giftName}`
        );
        break;
      case BadanmuType.follow:
        addDanmu(
          {
            id: payload.uuid,
            type: BadanmuType.follow,
            username: payload.playerName,
            content: '关注直播间',
          },
          `感谢${payload.playerName}关注直播间`
        );
        break;
      case BadanmuType.enter:
        textCarouselRef.current?.addItem({
          id: payload.uuid,
          type: BadanmuType.enter,
          username: payload.playerName,
          content: '进入直播间',
        });
        break;
      default:
        break;
    }
  });

  const ts = useRef(Date.now()).current;

  return (
    <Stack
      className='badanmu-app'
      style={{
        height: '100vh',
        backgroundSize: 'cover',
        backgroundImage: showBackground
          ? `url(https://picsum.photos/360/640?ts=${ts})`
          : 'none',
      }}
      spacing={0}
      ref={containerRef}
    >
      <DanmuList ref={danmuListRef} />
      <TextCarousel ref={textCarouselRef} />
    </Stack>
  );
}

export default () => {
  return (
    // <MantineProvider
    //   theme={{ colorScheme: 'light' }}
    //   withGlobalStyles
    //   withNormalizeCSS
    // >
    <BadanmuApp />
    // </MantineProvider>
  );
};
