import { useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import { withWindow } from 'renderer/components';
import { useFn } from 'renderer/hooks';

import './index.scss';

// import 'codemirror/mode/javascript/javascript';

interface Props {
  initialData: {
    content: string;
  };
}

function CodeEditor({ initialData: { content } }: Props) {
  const [privContent, setPrivContent] = useState(content);

  const handleChange = useFn((value: string) => {
    setPrivContent(value);
  });

  return (
    <CodeMirror
      value="<h1>I ♥ react-codemirror2</h1>"
      options={{
        mode: 'javascript',
        theme: 'material',
        lineNumbers: true,
      }}
      onChange={(editor, data, value) => {}}
    />
  );
}

export default withWindow(CodeEditor);
