import { useEffect, useRef } from 'react';
import { useAsync, useInterval } from 'react-use';
import { Stack } from '@mantine/core';

import { BadanmuState, BadanmuType } from 'const';

import { DanmuList, DanmuListHandle } from './Views/DanmuList';
import { TextCarousel, TextCarouselHandle } from './Views/TextCarousel';
import { useServerAliveSse } from './hooks';
import { deviceAlivePolling } from './requests';

import './App.scss';

function BadanmuApp() {
  const danmuListRef = useRef<DanmuListHandle>(null);
  const textCarouselRef = useRef<TextCarouselHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const polling = async () => {
    try {
      const { data } = await deviceAlivePolling();
      if (data.state === BadanmuState.disconnected) {
        danmuListRef.current?.addItem({
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

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      containerRef.current?.style.setProperty(
        'background-image',
        `url(https://picsum.photos/360/640?t=${Date.now()})`,
        'important'
      );
      containerRef.current?.style.setProperty('background-size', 'cover');
    }
  }, []);

  useServerAliveSse(({ type, payload }) => {
    // console.log({ type, payload });
    switch (type) {
      case BadanmuType.connect:
        danmuListRef.current?.addItem({
          id: payload.uuid,
          type: BadanmuType.connect,
          content: `已成功连接至房间 ${payload.platform} - ${payload.roomId}`,
        });
        break;
      case BadanmuType.disconnectUnexpect:
        danmuListRef.current?.addItem({
          id: payload.uuid,
          type: BadanmuType.disconnectUnexpect,
          content: `发生错误，已断开连接（${payload.data}）`,
        });
        break;
      case BadanmuType.disconnectManually:
        danmuListRef.current?.addItem({
          id: payload.uuid,
          type: BadanmuType.disconnectManually,
          content: `已主动断开连接`,
        });
        break;
      case BadanmuType.error:
        danmuListRef.current?.addItem({
          id: payload.uuid,
          type: BadanmuType.error,
          content: `发生错误 ${payload.data}`,
        });
        break;
      case BadanmuType.comment:
        danmuListRef.current?.addItem({
          id: payload.uuid,
          type: BadanmuType.comment,
          username: payload.playerName,
          content: payload.data,
          avatar:
            'https://i0.hdslb.com/bfs/article/2982bc4a8ac568c61f9e6b54ed2a0ad350bd07aa.jpg',
          image: payload.image,
        });
        break;
      case BadanmuType.gift:
        danmuListRef.current?.addItem({
          id: payload.uuid,
          type: BadanmuType.gift,
          username: payload.playerName,
          content: `赠送 ${payload.giftName} x ${payload.num}`,
          avatar: payload.avatar,
        });
        break;
      case BadanmuType.follow:
        danmuListRef.current?.addItem({
          id: payload.uuid,
          type: BadanmuType.follow,
          username: payload.playerName,
          content: '关注直播间',
        });
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
  return (
    <Stack
      className='badanmu-app'
      style={{ height: '100vh' }}
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
