import {
  Button,
  Grid,
  IconDownload,
  IconPlayerPlay,
  Loader,
  Space,
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
    <Grid justify='flex-end' style={{ width: '100%' }}>
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
      <Space w='sm' />
      <Button
        variant='default'
        leftIcon={<IconDownload size={14} />}
        onClick={onDownloadClick}
        disabled={disabled}
        size='xs'
      >
        Download
      </Button>
    </Grid>
  );
}
