import {
  Button,
  Group,
  IconDownload,
  IconPlayerPlay,
  Loader,
} from 'renderer/components';

interface Props {
  onPlayClick: () => void;
  onDownloadClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function Buttons({
  onPlayClick,
  disabled,
  loading,
  onDownloadClick,
}: Props) {
  return (
    <Group position='right' spacing='sm'>
      {loading && <Loader size='sm' />}
      <Button
        variant='default'
        leftIcon={<IconPlayerPlay size={14} />}
        onClick={onPlayClick}
        disabled={disabled}
        size='xs'
      >
        Play
      </Button>
      <Button
        variant='default'
        leftIcon={<IconDownload size={14} />}
        onClick={onDownloadClick}
        disabled={disabled}
        size='xs'
      >
        Download
      </Button>
    </Group>
  );
}
