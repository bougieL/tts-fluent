import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Avatar, Group, List, Stack, Text } from '@mantine/core';

import { BadanmuType } from 'const';

import './style.scss';

export interface Danmu {
  id: string;
  type: BadanmuType;
  username?: string;
  avatar?: string;
  content: string;
  image?: string;
}

export interface DanmuListHandle {
  addItem(item: Danmu): void;
}

export const DanmuList = forwardRef<DanmuListHandle>((_, ref) => {
  const [list, setList] = useState<Danmu[]>([]);

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: listRef.current.scrollHeight,
    });
  }, [list]);

  useImperativeHandle(
    ref,
    () => ({
      addItem(item) {
        setList((prev) => prev.slice(-29).concat(item));
      },
    }),
    []
  );

  return (
    <List listStyleType='none' className='danmu-list' ref={listRef}>
      {list.map((item) => {
        return (
          <List.Item
            className={`danmu-item danmu-item-${item.type}`}
            key={item.id}
          >
            {(() => {
              switch (item.type) {
                case BadanmuType.connect:
                case BadanmuType.disconnectUnexpect:
                case BadanmuType.disconnectManually:
                case BadanmuType.error:
                  return <Text className='text'>{item.content}</Text>;
                case BadanmuType.comment:
                case BadanmuType.gift:
                case BadanmuType.follow:
                  return (
                    <Group align='flex-start' spacing='xs' noWrap>
                      <Avatar src={item.avatar} className='avatar' />
                      <Stack className='text' spacing={0}>
                        <Text className='username'>{item.username}</Text>
                        {item.image ? (
                          <img
                            className='image'
                            src={item.image}
                            alt={item.content}
                          />
                        ) : (
                          <Text className='content'>{item.content}</Text>
                        )}
                      </Stack>
                    </Group>
                  );
                case BadanmuType.enter:
                  return (
                    <Text className='text'>
                      <span className='username'>{item.username}</span>
                      <span className='content'>{item.content}</span>
                    </Text>
                  );
                default:
                  return (
                    <Text className='text'>
                      Unhandled danmu type: {JSON.stringify(item)}
                    </Text>
                  );
              }
            })()}
          </List.Item>
        );
      })}
    </List>
  );
});
