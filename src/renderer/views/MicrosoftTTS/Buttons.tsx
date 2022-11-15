import { Button, Group, Loader } from '@mantine/core';
import { IconDownload, IconPlayerPlay, IconRefresh } from '@tabler/icons';

interface Props {
  onPlayClick: () => void;
  onDownloadClick: () => void;
  onResetClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function Buttons({
  onPlayClick,
  disabled,
  loading,
  onDownloadClick,
  onResetClick,
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
      <Button
        variant='default'
        leftIcon={<IconRefresh size={14} />}
        onClick={onResetClick}
        size='xs'
      >
        Reset
      </Button>
    </Group>
  );
}
