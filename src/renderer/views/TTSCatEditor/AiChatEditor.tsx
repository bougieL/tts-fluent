import list from '@bougiel/tts-node/lib/ssml/list';

import { Dropdown, FStack } from 'renderer/components';

const voices = list
  .filter((item) => item.Locale === 'zh-CN')
  .map((item) => {
    return {
      key: item.ShortName,
      text: `${item.LocalName} - ${item.DisplayName}`,
    };
  });

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
}

export function AiChatEditor({ value, onChange }: Props) {
  return (
    <FStack horizontal tokens={{ childrenGap: 24 }}>
      <Dropdown
        options={voices}
        label="Voice"
        placeholder="Select voice A"
        styles={{ root: { width: '33%' }, callout: { height: 400 } }}
        selectedKey={value[0]}
        disabled={voices.length === 0}
        onChange={(_, item) => {
          onChange([item?.key as string, value[1]]);
        }}
      />
      <Dropdown
        options={voices}
        label="Voice"
        placeholder="Select voice B"
        styles={{ root: { width: '33%' }, callout: { height: 400 } }}
        selectedKey={value[1]}
        disabled={voices.length === 0}
        onChange={(_, item) => {
          onChange([value[0], item?.key as string]);
        }}
      />
    </FStack>
  );
}
