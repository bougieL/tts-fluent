import { useEffect, useRef, useState } from 'react';
import { defaultKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';

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

  useEffect(() => {
    const startState = EditorState.create({
      doc: 'console.log("Hello World")',
      extensions: [keymap.of(defaultKeymap), javascript()],
    });

    editorRef.current = new EditorView({
      state: startState,
      parent: divRef.current!,
    });
  }, []);

  return <div ref={divRef} />;
}

export default withWindow(CodeEditor);
