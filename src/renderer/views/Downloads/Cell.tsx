import { useMemo, useState } from 'react';
import { clipboard, ipcRenderer, shell } from 'electron';
import fs from 'fs-extra';

import { DownloadsCache } from 'caches';
import { IpcEvents } from 'const';
import { getSize } from 'lib/getSize';
import {
  ActionIcon,
  Group,
  IconCopy,
  IconFolders,
  IconPlayerPlay,
  IconRefresh,
  IconTrash,
  List,
  Loader,
  Space,
  Text,
  Tooltip,
} from 'renderer/components';
import { useAsync, useAudio, useFn } from 'renderer/hooks';

export interface Item extends DownloadsCache.Item {
  text: string;
}

interface CellProps {
  item: Item;
}

export function Cell({ item }: CellProps) {
  const [exists, setExists] = useState(true);
  const [size, setSize] = useState('0 B');
  const { audio, setIsStreamAudio } = useAudio();

  const handlePlayClick = useFn(async () => {
    setIsStreamAudio(false);
    audio.setSource(item.path);
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

  const fileTip = useFn((text: string) => (exists ? text : 'File removed'));

  const renderDelete = useFn(() => {
    return (
      <Tooltip label='Delete'>
        <ActionIcon onClick={handleRemove}>
          <IconTrash size={16} />
        </ActionIcon>
      </Tooltip>
    );
  });

  const renderActions = useFn(() => {
    return (
      <>
        <Tooltip label={fileTip('Play')}>
          <ActionIcon onClick={handlePlayClick}>
            <IconPlayerPlay size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label='Copy SSML'>
          <ActionIcon
            onClick={() => {
              clipboard.writeText(item.content);
            }}
          >
            <IconCopy size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label='Copy pure text'>
          <ActionIcon
            onClick={() => {
              clipboard.writeText(item.text);
            }}
          >
            <IconCopy size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={fileTip('Open mp3 file in explorer')}>
          <ActionIcon
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
                  <Loader />
                  <Text>{size}</Text>
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
                  <ActionIcon onClick={handleRetryClick}>
                    <IconRefresh />
                  </ActionIcon>
                </Tooltip>
                {renderActions()}
              </Group>
            );
          case DownloadsCache.Status.finished:
            return (
              <Group position='right' align='center' spacing='sm'>
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
        size,
      ])}
    </List.Item>
  );
}
