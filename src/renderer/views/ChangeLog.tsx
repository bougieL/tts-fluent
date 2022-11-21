import { shell } from 'electron';
import { Button, Group, Stack, Text } from '@mantine/core';

import { withWindow } from 'renderer/components';
import { Markdown } from 'renderer/components/Markdown';

interface Props {
  title: string;
  initialData: {
    localVersion: string;
    remoteVersion: string;
    content: string;
  };
}

function ChangeLog({ title, initialData }: Props) {
  const { localVersion, remoteVersion, content } = initialData;

  return (
    <Stack>
      <Markdown text={`# ${title}\n${content}`} />
      <Group position='right' mt='lg'>
        <Text color='dimmed'>Local version: {localVersion}</Text>
        <Button
          onClick={() => {
            shell.openExternal(
              'https://github.com/bougieL/tts-fluent/releases'
            );
          }}
        >
          🤡 Update to {remoteVersion} 🤡
        </Button>
      </Group>
    </Stack>
  );
}

export default withWindow(ChangeLog);
