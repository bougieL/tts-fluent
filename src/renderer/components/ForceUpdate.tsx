import { shell } from 'electron';
import { Button, Group, Modal, Stack, Text } from '@mantine/core';

import { useVersion } from 'renderer/hooks';

import { Markdown } from './Markdown';

export function ForceUpdate() {
  const { forceUpdate, changeLog, remoteVersion, localVersion } = useVersion();

  return (
    <Modal
      withCloseButton={false}
      title='New version 🤡🤡🤡'
      opened={forceUpdate}
      onClose={() => {}}
      closeOnClickOutside={false}
    >
      <Stack spacing='lg'>
        <Markdown text={changeLog} />
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
    </Modal>
  );
}
