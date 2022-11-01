import { shell } from 'electron';

import { Button, Grid, Label, Space } from 'renderer/components';

const Feedback = () => {
  return (
    <>
      <Label>Feedback</Label>
      <Grid>
        <Button
          size='xs'
          onClick={() => {
            shell.openExternal(
              'https://github.com/bougieL/tts-fluent/issues/new?assignees=&labels=bug&template=1-Bug_report.md'
            );
          }}
        >
          Report a bug 🐛
        </Button>
        <Space w='sm' />
        <Button
          size='xs'
          onClick={() => {
            shell.openExternal(
              'https://github.com/bougieL/tts-fluent/issues/new?assignees=&labels=enhancement&template=3-Feature_request.md'
            );
          }}
        >
          Give a suggesstion 💻
        </Button>
      </Grid>
    </>
  );
};

export default Feedback;
