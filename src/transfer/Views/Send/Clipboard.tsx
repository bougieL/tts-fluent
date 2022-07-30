import {
  Label,
  Stack,
  PrimaryButton,
  DefaultButton,
  TextField,
} from '@fluentui/react';
import { useState } from 'react';
import { useAsync } from 'react-use';

const globalState: { text: string } = { text: '' };

export function Clipboard() {
  const [text, setText] = useState(globalState.text);
  useAsync(async () => {}, []);
  return (
    <Stack>
      <Label>Clipboard(Long press to paste or copy)</Label>
      <TextField
        value={text}
        onChange={(_, newValue) => {
          globalState.text = newValue!;
          setText(newValue!);
        }}
      />
      <Stack
        horizontalAlign="end"
        horizontal
        styles={{ root: { paddingTop: 12 } }}
        tokens={{ childrenGap: 12 }}
      >
        <DefaultButton iconProps={{ iconName: 'Download' }}>
          Get clipboard
        </DefaultButton>
        <PrimaryButton iconProps={{ iconName: 'Send' }} disabled={!text}>
          Send clipboard
        </PrimaryButton>
      </Stack>
    </Stack>
  );
}
