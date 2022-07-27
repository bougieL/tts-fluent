import {
  Stack,
  Text,
  Separator,
  TooltipHost,
  IconButton,
  ProgressIndicator,
} from '@fluentui/react';
import { clipboard, ipcRenderer, shell } from 'electron';
import { DownloadsCache } from 'caches';
import { useMemo, useState } from 'react';
import fs from 'fs-extra';
import { getSize } from 'lib/getSize';
import { useAudio, useAsync, useFn } from 'renderer/hooks';
import { IpcEvents } from 'const';

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
      <TooltipHost content="Delete" setAriaDescribedBy={false}>
        <IconButton
          iconProps={{ iconName: 'Delete' }}
          aria-label="Delete"
          onClick={handleRemove}
        />
      </TooltipHost>
    );
  });
  const renderActions = useFn(() => {
    return (
      <>
        <TooltipHost content={fileTip('Play')} setAriaDescribedBy={false}>
          <IconButton
            iconProps={{ iconName: 'Play' }}
            aria-label="Play"
            disabled={!exists}
            onClick={handlePlayClick}
          />
        </TooltipHost>
        <TooltipHost content="Copy SSML" setAriaDescribedBy={false}>
          <IconButton
            iconProps={{ iconName: 'Copy' }}
            aria-label="Copy"
            onClick={() => {
              clipboard.writeText(item.content);
            }}
          />
        </TooltipHost>
        <TooltipHost content="Copy pure text" setAriaDescribedBy={false}>
          <IconButton
            iconProps={{ iconName: 'PasteAsText' }}
            aria-label="Copy"
            onClick={() => {
              clipboard.writeText(item.text);
            }}
          />
        </TooltipHost>
        <TooltipHost
          content={fileTip('Open mp3 file in explorer')}
          setAriaDescribedBy={false}
        >
          <IconButton
            iconProps={{ iconName: 'MusicInCollection' }}
            aria-label="MusicInCollection"
            disabled={!exists}
            onClick={() => {
              shell.showItemInFolder(item.path);
            }}
          />
        </TooltipHost>
        {renderDelete()}
      </>
    );
  });
  useAsync(async () => {
    const updater = async () => {
      const exists = await fs.pathExists(item.path);
      setExists(exists && item.status === DownloadsCache.Status.finished);
      const size = await getSize(item.path);
      setSize(size);
    };
    updater();
    if (await fs.pathExists(item.path)) {
      const watcher = fs.watch(item.path, updater);
      return watcher.close;
    }
    return () => {};
  }, [item.path]);
  return (
    <Stack>
      <Separator />
      <Text variant="xLarge">{item.text.slice(0, 20)}</Text>
      <Text>
        {item.text.length > 200 ? `${item.text.slice(0, 200)}...` : item.text}
      </Text>
      {useMemo(() => {
        switch (item.status) {
          case DownloadsCache.Status.downloading:
            return (
              <Stack
                horizontal
                horizontalAlign="space-between"
                verticalAlign="center"
                tokens={{ childrenGap: 20 }}
              >
                <ProgressIndicator
                  label="Downloading"
                  description={size}
                  styles={{ root: { flex: 1 } }}
                />
                {renderDelete()}
              </Stack>
            );
          case DownloadsCache.Status.error:
            return (
              <Stack
                horizontal
                verticalAlign="center"
                horizontalAlign="end"
                tokens={{ childrenGap: 10 }}
              >
                <Text variant="small" color="red">
                  Download failed
                </Text>
                <Text variant="small">
                  {new Date(item.date).toLocaleString()}
                </Text>
                <TooltipHost content="Retry" setAriaDescribedBy={false}>
                  <IconButton
                    iconProps={{ iconName: 'Refresh' }}
                    aria-label="Retry"
                    onClick={handleRetryClick}
                  />
                </TooltipHost>
                {renderActions()}
              </Stack>
            );
          case DownloadsCache.Status.finished:
            return (
              <Stack
                horizontal
                horizontalAlign="end"
                verticalAlign="center"
                styles={{ root: { paddingTop: 12 } }}
                tokens={{ childrenGap: 10 }}
              >
                <Text variant="small">
                  {new Date(item.date).toLocaleString()}
                </Text>
                {renderActions()}
              </Stack>
            );
          default:
            return null;
        }
      }, [
        handleRetryClick,
        item.date,
        item.status,
        renderActions,
        renderDelete,
        size,
      ])}
    </Stack>
  );
}
