import { useState } from 'react';
import { useAsync } from 'react-use';
import { Stack, StackProps, useMantineTheme } from '@mantine/core';

import './style.scss';

interface Props extends StackProps {
  text: string;
}

export function Markdown({ text, ...restProps }: Props) {
  const { colorScheme } = useMantineTheme();
  const [html, setHtml] = useState('');
  useAsync(async () => {
    const { marked } = await import('marked');
    const html = marked(text);
    setHtml(html);
  }, [text]);

  return (
    <Stack
      {...restProps}
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
