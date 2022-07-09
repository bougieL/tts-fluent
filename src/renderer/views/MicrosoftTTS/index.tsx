import { Stack, TextField } from '@fluentui/react';

const MicrosoftTTS = () => {
  return (
    <Stack horizontal tokens={{ childrenGap: 10 }}>
      <TextField
        label="Input Text"
        multiline
        rows={6}
        width="100%"
        resizable={false}
      />
    </Stack>
  );
};

export default MicrosoftTTS;
