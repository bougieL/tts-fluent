import { useState } from 'react';
import { useAsync } from 'react-use';
import { Stack, useMantineTheme } from '@mantine/core';

import { withWindow } from 'renderer/components';

import './style.scss';

interface Props {
  title: string;
  initialData: {
    title: string;
    content: string;
    confirmUrl?: string;
  };
}

function Markdown({ title, initialData }: Props) {
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
      className={colorScheme === 'light' ? 'markdown-light' : 'markdown-dark'}
    >
      <article
        className='markdown-body'
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Stack>
  );
}

export default withWindow(Markdown);
