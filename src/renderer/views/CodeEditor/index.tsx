import { useRef, useState } from 'react';

import { withWindow } from 'renderer/components';
import { useAsync, useFn } from 'renderer/hooks';

import './index.scss';

interface Props {
  initialData: {
    content: string;
  };
}

function CodeEditor({ initialData: { content } }: Props) {
  const [privContent, setPrivContent] = useState(content);

  const divRef = useRef<HTMLDivElement>(null);

  // const editorRef = useRef<EditorView>();

  const handleChange = useFn((value: string) => {
    setPrivContent(value);
  });

  useAsync(async () => {
    const [
      { defaultKeymap },
      { javascript },
      { EditorState },
      { EditorView, keymap },
    ] = await Promise.all([
      import('@codemirror/commands'),
      import('@codemirror/lang-javascript'),
      import('@codemirror/state'),
      import('@codemirror/view'),
    ]);
    const startState = EditorState.create({
      doc: 'console.log("Hello World")',
      extensions: [keymap.of(defaultKeymap), javascript()],
    });

    const editorView = new EditorView({
      state: startState,
      parent: divRef.current!,
    });
  }, []);

  return <div ref={divRef} />;
}

export default withWindow(CodeEditor);
