import { useState } from 'react';

import { Separator, Stack, withWindow } from 'renderer/components';
import { useFn } from 'renderer/hooks';

import { SsmlConfig, SsmlDistributor } from '../MicrosoftTTS/SsmlDistributor';

interface Props {
  initialData: {
    textConfig: SsmlConfig;
    onTextConfigChange: (v: SsmlConfig) => void;
  };
}

function TTSCatEditor({
  initialData: { textConfig, onTextConfigChange },
}: Props) {
  const [privTextConfig, setPrivTextConfig] = useState(textConfig);
  const handleTextConfigChange = useFn(async (config: SsmlConfig) => {
    setPrivTextConfig(config);
    onTextConfigChange(config);
  });

  return (
    <Stack
      tokens={{ childrenGap: 12 }}
      styles={{ root: { paddingLeft: 12, paddingRight: 12 } }}
    >
      <SsmlDistributor
        value={privTextConfig}
        onChange={handleTextConfigChange}
      />
      <Separator />
    </Stack>
  );
}

export default withWindow(TTSCatEditor);
