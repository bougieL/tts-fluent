import { useState } from 'react';

import { useAsync } from 'renderer/hooks';

import './style.scss';

export function Markdown() {
  const [html, setHtml] = useState('');
  useAsync(async () => {
    const { title, content } = window.markdown;
    const { marked } = await import('marked');
    const html = marked(`# ${title}\n${content}`);
    setHtml(html);
  }, []);
  return (
    <article
      className="markdown-body"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
