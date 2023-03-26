import { useDropzone } from 'react-dropzone';
import { Text, useMantineTheme } from '@mantine/core';

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
  const { colorScheme, colors } = useMantineTheme();

  return (
    <div
      {...getRootProps()}
      style={{
        height: 'calc(100vh - 352px)',
        border: '1px solid #ccc',
        borderColor: colorScheme === 'light' ? colors.gray[4] : colors.gray[8],
        backgroundColor: colorScheme === 'light' ? undefined : colors.dark[6],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '4px',
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
