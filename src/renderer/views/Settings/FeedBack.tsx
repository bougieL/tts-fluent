import { DefaultButton, Label, Stack } from '@fluentui/react';
import { shell } from 'electron';

const Feedback = () => {
  return (
    <>
      <Label>Feedback</Label>
      <Stack
        horizontal
        horizontalAlign="start"
        tokens={{ childrenGap: 12 }}
        styles={{ root: { marginTop: '0 !important' } }}
      >
        <DefaultButton
          onClick={() => {
            shell.openExternal(
              'https://github.com/bougieL/tts-fluent/issues/new?assignees=&labels=bug&template=1-Bug_report.md'
            );
          }}
        >
          Report a bug 🐛
        </DefaultButton>
        <DefaultButton
          onClick={() => {
            shell.openExternal(
              'https://github.com/bougieL/tts-fluent/issues/new?assignees=&labels=enhancement&template=3-Feature_request.md'
            );
          }}
        >
          Give a suggesstion 💻
        </DefaultButton>
      </Stack>
    </>
  );
};

export default Feedback;
