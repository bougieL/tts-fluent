import { useState } from 'react';
import { useAsync } from 'react-use';
import { shell } from 'electron';
import { Button, Group, Stack, useMantineTheme } from '@mantine/core';

import { withWindow } from 'renderer/components';

interface Props {
  title: string;
  initialData: {
    title: string;
    content: string;
  };
}

function ForceUpdate({ title, initialData }: Props) {
  const { colorScheme } = useMantineTheme();
  const [html, setHtml] = useState('');
  useAsync(async () => {
    const { content } = initialData;
    const { marked } = await import('marked');
    const html = marked(`# ${title}\n${content}`);
    setHtml(html);
  }, []);
  return (
    <Stack
      spacing='lg'
      className={colorScheme === 'light' ? 'markdown-light' : 'markdown-dark'}
    >
      <article
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <Group position='right'>
        <Button
          onClick={() => {
            shell.openExternal(
              'https://github.com/bougieL/tts-fluent/releases'
            );
          }}
        >
          Update to latest version
        </Button>
      </Group>
    </Stack>
  );
}

export default withWindow(ForceUpdate);
