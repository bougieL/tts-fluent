import { DefaultButton, PrimaryButton, Spinner, Stack } from '@fluentui/react';

interface Props {
  playing: boolean;
  onPlayClick: () => void;
  onDownloadClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function Buttons({
  playing,
  onPlayClick,
  disabled,
  loading,
  onDownloadClick,
}: Props) {
  return (
    <Stack horizontal tokens={{ childrenGap: 24 }} horizontalAlign="end">
      {loading && <Spinner />}
      <PrimaryButton
        text={playing ? 'Stop' : 'Play'}
        iconProps={
          playing
            ? { iconName: 'StopSolid' }
            : { iconName: 'TriangleSolidRight12' }
        }
        onClick={onPlayClick}
        allowDisabledFocus
        disabled={disabled}
      />
      <DefaultButton
        text="Download"
        iconProps={{ iconName: 'save' }}
        onClick={onDownloadClick}
        allowDisabledFocus
        disabled={disabled}
      />
    </Stack>
  );
}
