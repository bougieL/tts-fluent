import { useEffect, useState } from 'react';
import { ssmlToText, textToSsml } from '@bougiel/tts-node/lib/ssml';

import { Pivot, PivotItem, Stack, TextField } from 'renderer/components';
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
  return (
    <Stack tokens={{ childrenGap: 18 }}>
      <Pivot
        styles={{
          text: { fontSize: 14 },
          link: { height: 26 },
        }}
        // linkFormat="tabs"
        selectedKey={type}
        onLinkClick={(item) => {
          const type = item?.props.itemKey as InputType;
          setType(type);
          globalState.type = type;
        }}
      >
        <PivotItem headerText="Text" itemKey={InputType.text} />
        <PivotItem headerText="File" itemKey={InputType.file} />
        <PivotItem headerText="SSML" itemKey={InputType.ssml} />
      </Pivot>
      {type !== InputType.file ? (
        <TextField
          multiline
          rows={6}
          resizable={false}
          styles={{
            root: { width: '100%' },
            field: { height: 'calc(100vh - 352px)' },
          }}
          value={isText ? text : ssml}
          placeholder="Type something here (max 25000 characters, 200 requests per day)..."
          maxLength={25000}
          onChange={(_, value = '') => {
            if (isText) {
              setRText(value);
            } else {
              setRSsml(value);
            }
          }}
        />
      ) : (
        <Dropzone value={file} onChange={handleFileChange} />
      )}
    </Stack>
  );
}
