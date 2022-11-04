import { useState } from 'react';
import { useAsync } from 'react-use';

import { withWindow } from 'renderer/components';

import './style.scss';

interface Props {
  initialData: {
    title: string;
    content: string;
  };
}

function Markdown({ initialData }: Props) {
  const [html, setHtml] = useState('');
  useAsync(async () => {
    const { title, content } = initialData;
    const { marked } = await import('marked');
    const html = marked(`# ${title}\n${content}`);
    setHtml(html);
  }, []);
  return (
    <article
      className='markdown-body'
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default withWindow(Markdown);
