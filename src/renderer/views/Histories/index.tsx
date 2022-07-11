import { ssmlToText } from '@bougiel/tts-node/lib/ssml';
import {
  FocusZone,
  FocusZoneDirection,
  List,
  Stack,
  TextField,
  Text,
  Separator,
  TooltipHost,
  IconButton,
} from '@fluentui/react';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAsync } from 'react-use';
import './index.scss';

interface Item {
  id: string;
  text: string;
  ssml: string;
  date: number;
  path: string;
  exists: boolean;
}

interface CellProps {
  item: Item;
  index: number;
  onRemove: (id: string) => void;
  onPlay: (id: string) => void;
}

const context = createContext({ playing: false, playingId: '' });

const audio = new Audio();

function Cell({ item, index, onRemove, onPlay }: CellProps) {
  const { playing, playingId } = useContext(context);
  const isCurrentPlaying = playing && playingId === item.id;
  const handlePlayClick = async () => {
    onPlay(item.id);
    audio.pause();
    audio.currentTime = 0;
    if (isCurrentPlaying) {
      return;
    }
    const data = await window.electron.ipcRenderer.invoke(
      'tts.hisotries.playItem',
      item.path
    );
    const blob = new Blob([data], { type: 'audio/mp3' });
    const url = window.URL.createObjectURL(blob);
    audio.src = url;
    audio.play();
  };
  const fileTip = (text: string) => (item.exists ? text : 'File removed');
  return (
    <Stack>
      <Separator />
      <Text variant="xLarge">{item.text.slice(0, 20)}</Text>
      <Text>
        {item.text.length > 200 ? `${item.text.slice(0, 200)}...` : item.text}
      </Text>
      <Stack
        horizontal
        horizontalAlign="end"
        verticalAlign="center"
        styles={{ root: { paddingTop: 12 } }}
        tokens={{ childrenGap: 8 }}
      >
        <Text variant="small" className="history-item-date">
          {new Date(item.date).toLocaleString()}
        </Text>
        <TooltipHost
          content={fileTip(isCurrentPlaying ? 'Stop' : 'Play')}
          setAriaDescribedBy={false}
        >
          <IconButton
            iconProps={{ iconName: isCurrentPlaying ? 'Stop' : 'Play' }}
            aria-label="Play"
            disabled={!item.exists}
            onClick={handlePlayClick}
          />
        </TooltipHost>
        <TooltipHost content="Copy SSML" setAriaDescribedBy={false}>
          <IconButton
            iconProps={{ iconName: 'Copy' }}
            aria-label="Copy"
            onClick={() => {
              navigator.clipboard.writeText(item.ssml);
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
            disabled={!item.exists}
            onClick={() => {
              window.electron.shell.showItemInFolder(item.path);
            }}
          />
        </TooltipHost>
        <TooltipHost content="Delete" setAriaDescribedBy={false}>
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            aria-label="Delete"
            onClick={() => onRemove?.(item.id)}
          />
        </TooltipHost>
      </Stack>
    </Stack>
  );
}

const globalState = {
  filter: '',
};

function Histories() {
  const [list, setList] = useState<Item[]>([]);
  const [filterReg, setFilterReg] = useState<RegExp>();
  const [playingId, setPlayingId] = useState('');
  const [filter, setFilter] = useState(globalState.filter);
  useAsync(async () => {
    const data = await window.electron.ipcRenderer.invoke(
      'tts.histories.getList'
    );
    const list: Item[] = data
      .map((item: any) => {
        return {
          id: item.id,
          text: ssmlToText(item.content).replace(/[\r\n\s]/g, ''),
          ssml: item.content,
          date: item.date,
          path: item.path,
          exists: item.exists,
        };
      })
      .sort((a, b) => b.date - a.date);
    setList(list);
  }, []);
  const handleRemove = async (id: string) => {
    await window.electron.ipcRenderer.invoke('tts.histories.removeItem', id);
    setList((list) => list.filter((item) => item.id !== id));
  };
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const handleFilterChange = (value: string) => {
    setFilter(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const v = value.trim();
      if (v) {
        setFilterReg(new RegExp(v.split(/\s+/).join('.*')));
      } else {
        setFilterReg(undefined);
      }
    }, 500);
  };
  const filteredList = useMemo(() => {
    return filterReg ? list.filter((item) => filterReg.test(item.text)) : list;
  }, [filterReg, list]);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const handleEnd = () => {
      setPlaying(false);
    };
    const handlePlay = () => {
      setPlaying(true);
    };
    audio.addEventListener('ended', handleEnd);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handleEnd);
    return () => {
      audio.removeEventListener('ended', handleEnd);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handleEnd);
    };
  }, []);
  return (
    <context.Provider value={{ playing, playingId }}>
      <FocusZone direction={FocusZoneDirection.vertical}>
        <TextField
          label="Search content"
          value={filter}
          onChange={(_, value) => handleFilterChange(value!)}
        />
        <Stack
          styles={{ root: { height: 'calc(100vh - 160px)', overflow: 'auto' } }}
        >
          <List<Item>
            items={filteredList}
            className="history-list"
            ignoreScrollingState
            onRenderCell={(item, index) => (
              <Cell
                item={item!}
                index={index!}
                onRemove={handleRemove}
                onPlay={setPlayingId}
              />
            )}
          />
        </Stack>
      </FocusZone>
    </context.Provider>
  );
}

export default Histories;
