import { DefaultButton, Label, PrimaryButton, Stack } from '@fluentui/react';
import { Dropzone } from './Dropzone';

export function SendFiles() {
  return (
    <Stack horizontal>
      <Stack horizontalAlign="end" tokens={{ childrenGap: 12 }}>
        <Stack>
          <Label>Transfer files</Label>
          <Dropzone />
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 12 }}>
          <DefaultButton iconProps={{ iconName: 'delete' }}>
            Clear Files
          </DefaultButton>
          <PrimaryButton iconProps={{ iconName: 'send' }}>
            Send Files
          </PrimaryButton>
        </Stack>
      </Stack>
    </Stack>
  );
}
