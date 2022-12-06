import { useEffect, useRef } from 'react';
import { Group, List, Text } from '@mantine/core';

import { DanmuType } from 'const';

import './style.scss';

export interface Danmu {
  id: string;
  type: DanmuType;
  username?: string;
  avatar?: string;
  content: string;
}

interface Props {
  data: Danmu[];
}

export function DanmuList({ data }: Props) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: listRef.current.scrollHeight,
    });
  }, [data]);

  return (
    <List listStyleType='none' className='danmu-list' ref={listRef}>
      {data.map((item) => {
        return (
          <List.Item className='danmu-item' key={item.id}>
            <Text className='danmu-text'>
              <span className='username'>
                {item.username ? `${item.username}: ` : ''}
              </span>
              <span className='content'>{item.content}</span>
            </Text>
          </List.Item>
        );
      })}
    </List>
  );
}
