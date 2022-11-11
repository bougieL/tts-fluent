import { voices } from '@bougiel/tts-node';
import { Grid, NativeSelect } from '@mantine/core';

const cnVoices = voices
  .filter((item) => item.Locale === 'zh-CN')
  .sort((a, b) => (a.ShortName > b.ShortName ? 1 : -1))
  .map((item) => {
    return {
      value: item.ShortName,
      label: `${item.LocalName} - ${item.DisplayName}`,
    };
  });

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
}

export function AiChatEditor({ value, onChange }: Props) {
  return (
    <Grid>
      <Grid.Col span={4}>
        <NativeSelect
          data={cnVoices}
          label='Voice A'
          placeholder='Select voice A'
          value={value[0]}
          disabled={cnVoices.length === 0}
          onChange={(event) => {
            onChange([event.target.value, value[1]]);
          }}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <NativeSelect
          data={cnVoices}
          label='Voice B'
          placeholder='Select voice B'
          value={value[1]}
          disabled={cnVoices.length === 0}
          onChange={(event) => {
            onChange([value[0], event.target.value]);
          }}
        />
      </Grid.Col>
    </Grid>
  );
}
