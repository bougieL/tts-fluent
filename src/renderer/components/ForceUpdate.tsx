import { shell } from 'electron';
import { Button, Group, Modal, Stack } from '@mantine/core';

import { useVersion } from 'renderer/hooks';

import { Markdown } from './Markdown';

export function ForceUpdate() {
  const { forceUpdate, changeLog } = useVersion();

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
        <Group position='right'>
          <Button
            onClick={() => {
              shell.openExternal(
                'https://github.com/bougieL/tts-fluent/releases'
              );
            }}
          >
            🤡 Update to latest version 🤡
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
