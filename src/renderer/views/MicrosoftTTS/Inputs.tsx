import { useEffect, useState } from 'react';
import { ssmlToText, textToSsml } from '@bougiel/tts-node/lib/ssml';
import { Tabs, Textarea } from '@mantine/core';
import { IconBlockquote, IconCode, IconFile } from '@tabler/icons';

import { useFn } from 'renderer/hooks';

import { Dropzone } from './Dropzone';
import { SsmlConfig } from './SsmlDistributor';

export enum InputType {
  text = 'text',
  file = 'file',
  ssml = 'ssml',
}

interface Props {
  ssmlConfig: SsmlConfig;
  onChange: (ssml: string, empty: boolean) => void;
}

const globalState: {
  text: string;
  ssml: string;
  file?: File;
  type: InputType;
} = {
  text: '',
  ssml: '',
  type: InputType.text,
};

export function Inputs({ ssmlConfig, onChange }: Props) {
  const [text, setText] = useState(globalState.text);
  const [ssml, setSsml] = useState(globalState.ssml);
  const [file, setFile] = useState(globalState.file);
  const [type, setType] = useState(globalState.type);
  const isText = type === InputType.text;

  const setRText = useFn((text: string) => {
    setText(text);
    const ssml = textToSsml(text, ssmlConfig);
    setSsml(ssml);
    globalState.text = text;
    globalState.ssml = ssml;
  });

  const setRSsml = useFn((ssml: string) => {
    setSsml(ssml);
    const text = ssmlToText(ssml);
    setText(text);
    globalState.text = text;
    globalState.ssml = ssml;
  });

  useEffect(() => {
    onChange(ssml, !text.trim());
  }, [onChange, ssml, text]);

  useEffect(() => {
    if (isText) {
      setRText(text);
    } else {
      setRSsml(ssml);
    }
  }, [isText, setRSsml, setRText, ssml, ssmlConfig, text]);

  const handleFileChange = async (file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => {
      setFile(file);
      globalState.file = file;
      setRText((fileReader.result as string).slice(0, 25000));
    };
    fileReader.onerror = () => {
      alert('Not a valid text file');
    };
  };

  const renderTextArea = (text: string, onChange: (text: string) => void) => {
    return (
      <Textarea
        minRows={6}
        maxRows={6}
        styles={{ input: { height: 'calc(100vh - 352px)' } }}
        value={text}
        placeholder='Type something here (max 25000 characters, 200 requests per day)...'
        maxLength={25000}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    );
  };

  return (
    <Tabs
      value={type}
      onTabChange={(type: InputType) => {
        setType(type);
        globalState.type = type;
      }}
    >
      <Tabs.List>
        <Tabs.Tab value={InputType.text} icon={<IconBlockquote size={14} />}>
          Text
        </Tabs.Tab>
        <Tabs.Tab value={InputType.file} icon={<IconFile size={14} />}>
          File
        </Tabs.Tab>
        <Tabs.Tab value={InputType.ssml} icon={<IconCode size={14} />}>
          SSML
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value={InputType.text} pt='xs'>
        {renderTextArea(text, setRText)}
      </Tabs.Panel>
      <Tabs.Panel value={InputType.file} pt='xs'>
        <Dropzone value={file} onChange={handleFileChange} />
      </Tabs.Panel>
      <Tabs.Panel value={InputType.ssml} pt='xs'>
        {renderTextArea(ssml, setRSsml)}
      </Tabs.Panel>
    </Tabs>
  );
}
