import { useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import { clipboard, ipcRenderer, shell } from 'electron';
import {
  ActionIcon,
  Group,
  List,
  Loader,
  Space,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconCopy,
  IconFolders,
  IconForms,
  IconPlayerPlay,
  IconRefresh,
  IconTrash,
} from '@tabler/icons';
import fs from 'fs-extra';

import { DownloadsCache } from 'caches';
import { IpcEvents } from 'const';
import { getSize } from 'lib/getSize';
import { useFn, useGetAudio } from 'renderer/hooks';

export interface Item extends DownloadsCache.Item {
  text: string;
}

interface CellProps {
  item: Item;
}

export function Cell({ item }: CellProps) {
  const [exists, setExists] = useState(true);
  const [size, setSize] = useState('0 B');
  const getAudio = useGetAudio();

  const handlePlayClick = useFn(async () => {
    const audio = getAudio();
    const readStream = fs.createReadStream(item.path);
    readStream.pipe(audio);
    audio.play();
  });

  const handleRemove = useFn(async () => {
    const sure = confirm('Are you sure to delete this record?');
    if (sure) {
      ipcRenderer.invoke(IpcEvents.ttsMidrosoftDownloadRemove, item.id);
    }
  });

  const handleRetryClick = useFn(async () => {
    await ipcRenderer.invoke(IpcEvents.ttsMicrosoftDownload, {
      ssml: item.content,
      id: item.id,
    });
  });

  const renderDelete = useFn(() => {
    return (
      <Tooltip label='Delete'>
        <ActionIcon color='indigo' onClick={handleRemove}>
          <IconTrash size={16} />
        </ActionIcon>
      </Tooltip>
    );
  });

  const renderActions = useFn(() => {
    return (
      <>
        <Tooltip label='Play'>
          <ActionIcon
            onClick={handlePlayClick}
            color='indigo'
            disabled={!exists}
          >
            <IconPlayerPlay size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label='Copy SSML'>
          <ActionIcon
            onClick={() => {
              clipboard.writeText(item.content);
            }}
            color='indigo'
          >
            <IconCopy size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label='Copy pure text'>
          <ActionIcon
            color='indigo'
            onClick={() => {
              clipboard.writeText(item.text);
            }}
          >
            <IconForms size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label='Open mp3 file in explorer'>
          <ActionIcon
            color='indigo'
            disabled={!exists}
            onClick={() => {
              shell.showItemInFolder(item.path);
            }}
          >
            <IconFolders size={16} />
          </ActionIcon>
        </Tooltip>
        {renderDelete()}
      </>
    );
  });

  const renderUnexists = useFn(() => {
    return (
      exists || (
        <Text size='xs' color='red'>
          This file has beed removed
        </Text>
      )
    );
  });

  const renderDate = useFn(() => {
    return (
      <Text size='xs' color='dimmed'>
        {new Date(item.date).toLocaleString()}
      </Text>
    );
  });

  useAsync(async () => {
    const updater = async () => {
      const exists = await fs.pathExists(item.path);
      setExists(exists && item.status === DownloadsCache.Status.finished);
      const size = await getSize(item.path);
      setSize(size);
    };
    await updater();
    if (await fs.pathExists(item.path)) {
      const watcher = fs.watch(item.path, updater);
      return watcher.close;
    }
    return () => {};
  }, [item.path, item.status]);

  return (
    <List.Item>
      <Text>{item.text.slice(0, 20)}</Text>
      <Space h={4} />
      <Text size='sm' color='dimmed'>
        {item.text.length > 200 ? `${item.text.slice(0, 200)}...` : item.text}
      </Text>
      <Space h='sm' />
      {useMemo(() => {
        switch (item.status) {
          case DownloadsCache.Status.downloading:
            return (
              <Group position='apart' align='center' spacing={20}>
                <Group spacing='xs'>
                  <Loader size='xs' />
                  <Text size='xs' color='dimmed'>
                    {size}
                  </Text>
                </Group>
                {renderDelete()}
              </Group>
            );
          case DownloadsCache.Status.error:
            return (
              <Group position='right' align='center' spacing={10}>
                <Text size='xs' color='red'>
                  Download failed
                </Text>
                {renderDate()}
                <Tooltip label='Retry'>
                  <ActionIcon onClick={handleRetryClick} color='blue'>
                    <IconRefresh />
                  </ActionIcon>
                </Tooltip>
                {renderActions()}
              </Group>
            );
          case DownloadsCache.Status.finished:
            return (
              <Group position='right' align='center' spacing='sm'>
                {renderUnexists()}
                {renderDate()}
                {renderActions()}
              </Group>
            );
          default:
            return null;
        }
      }, [
        handleRetryClick,
        item.status,
        renderActions,
        renderDate,
        renderDelete,
        renderUnexists,
        size,
      ])}
    </List.Item>
  );
}
