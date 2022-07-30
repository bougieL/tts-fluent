import { useDropzone } from 'react-dropzone';
import { Text } from '@fluentui/react';

interface Props {
  value?: File;
  onChange?: (file: File) => void;
}

export function Dropzone({ value, onChange }: Props) {
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    onChange?.(file);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        height: 'calc(100vh - 390px + 2px)',
        border: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <input {...getInputProps()} multiple={false} />
      {isDragActive ? (
        <Text>Drop a file here ...</Text>
      ) : (
        <Text>
          Drag and drop a text file here, or click to select a text file
          <br />
          {value && `Current select file: ${value.name}`}
        </Text>
      )}
    </div>
  );
}
