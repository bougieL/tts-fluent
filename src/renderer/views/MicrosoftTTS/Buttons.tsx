import { Button, Grid, Space, Spinner } from 'renderer/components';

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
    <Grid justify="flex-end" style={{ width: '100%' }}>
      {loading && <Spinner />}
      <Button onClick={onPlayClick} disabled={disabled} size="xs">
        Play
      </Button>
      <Space w="sm" />
      <Button onClick={onDownloadClick} disabled={disabled} size="xs">
        Download
      </Button>
    </Grid>
  );
}
