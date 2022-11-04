import { useRef, useState } from 'react';
import { useAsync } from 'react-use';
import type { EditorView } from 'codemirror';

import { withWindow } from 'renderer/components';
import { useFn } from 'renderer/hooks';

import './index.scss';

interface Props {
  initialData: {
    content: string;
  };
}

function CodeEditor({ initialData: { content } }: Props) {
  const [privContent, setPrivContent] = useState(content);

  const divRef = useRef<HTMLDivElement>(null);

  const editorRef = useRef<EditorView>();

  const handleChange = useFn((value: string) => {
    setPrivContent(value);
  });

  useAsync(async () => {
    const [{ EditorView, basicSetup }, { EditorState }, { javascript }] =
      await Promise.all([
        import('codemirror'),
        import('@codemirror/state'),
        import('@codemirror/lang-javascript'),
      ]);
    const startState = EditorState.create({
      doc: `function foo() {
  console.log("hello world")
}`,
      extensions: [basicSetup, javascript()],
    });

    editorRef.current = new EditorView({
      state: startState,
      parent: divRef.current!,
    });
  }, []);

  return <div ref={divRef} style={{ flex: 1, outline: 'none' }} />;
}

export default withWindow(CodeEditor);
