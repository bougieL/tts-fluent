import {
  Stack,
  Text,
  Separator,
  TooltipHost,
  IconButton,
  ProgressIndicator,
} from '@fluentui/react';
import { clipboard, shell } from 'electron';
import { DownloadsCache } from 'caches';
import { useState } from 'react';
import fs from 'fs-extra';
import { getSize } from 'lib/getSize';
import { useAudio, useAsync } from 'renderer/hooks';

export interface Item extends DownloadsCache.Item {
  text: string;
}

interface CellProps {
  item: Item;
}

export function Cell({ item }: CellProps) {
  const [exists, setExists] = useState(true);
  const [size, setSize] = useState('0 B');
  const audio = useAudio();
  const handlePlayClick = async () => {
    audio.setSource(item.path);
    audio.play();
  };
  const handleRemove = async () => {
    DownloadsCache.removeItem(item.id);
  };
  const fileTip = (text: string) => (exists ? text : 'File removed');
  useAsync(async () => {
    const updater = async () => {
      const exists = await fs.pathExists(item.path);
      setExists(exists);
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
      {item.status === DownloadsCache.Status.downloading ? (
        <ProgressIndicator label="Downloading" description={size} />
      ) : (
        <Stack
          horizontal
          horizontalAlign="end"
          verticalAlign="center"
          styles={{ root: { paddingTop: 12 } }}
          tokens={{ childrenGap: 8 }}
        >
          <Text variant="small">{new Date(item.date).toLocaleString()}</Text>
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
          <TooltipHost content="Delete" setAriaDescribedBy={false}>
            <IconButton
              iconProps={{ iconName: 'Delete' }}
              aria-label="Delete"
              onClick={handleRemove}
            />
          </TooltipHost>
        </Stack>
      )}
    </Stack>
  );
}
