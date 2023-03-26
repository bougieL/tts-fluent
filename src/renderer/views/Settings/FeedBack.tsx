import { shell } from 'electron';
import { Button, Group, Input } from '@mantine/core';

const Feedback = () => {
  return (
    <Input.Wrapper label='Feedback'>
      <Group spacing='sm'>
        <Button
          size='xs'
          variant='default'
          onClick={() => {
            shell.openExternal(
              'https://github.com/bougieL/tts-fluent/issues/new?assignees=&labels=bug&template=1-Bug_report.md'
            );
          }}
        >
          Report a bug 🐛
        </Button>
        <Button
          size='xs'
          variant='default'
          onClick={() => {
            shell.openExternal(
              'https://github.com/bougieL/tts-fluent/issues/new?assignees=&labels=enhancement&template=3-Feature_request.md'
            );
          }}
        >
          Give a suggesstion 💻
        </Button>
      </Group>
    </Input.Wrapper>
  );
};

export default Feedback;
