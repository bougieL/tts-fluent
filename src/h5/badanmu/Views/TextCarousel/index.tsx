import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { List, Text } from '@mantine/core';

import { Danmu } from '../DanmuList';

import './styles.scss';

export interface TextCarouselHandle {
  addItem(item: Danmu): void;
}

export const TextCarousel = forwardRef<TextCarouselHandle>((_, ref) => {
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
        setList((prev) => prev.slice(-2).concat(item));
      },
    }),
    []
  );

  return (
    <List listStyleType='none' className='text-list' ref={listRef}>
      {list.map((item) => {
        return (
          <List.Item className='text-item' key={item.id}>
            <Text className='text'>
              <span className='username'>{item.username}</span>
              <span className='content'>{item.content}</span>
            </Text>
          </List.Item>
        );
      })}
    </List>
  );
});
