import { withWindow } from 'renderer/components';
import { Markdown } from 'renderer/components/Markdown';

import './style.scss';

interface Props {
  title: string;
  initialData: {
    title: string;
    content: string;
    confirmUrl?: string;
  };
}

function ChangeLog({ title, initialData }: Props) {
  return <Markdown text={`# ${title}\n${initialData.content}`} />;
}

export default withWindow(ChangeLog);
