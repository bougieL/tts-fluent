import { useDropzone } from 'react-dropzone';
import { Text } from '@fluentui/react';

interface Props {
  value?: File[];
  onChange?: (files: File[]) => void;
}

export function Dropzone({ value = [], onChange }: Props) {
  const onDrop = (files: File[]) => {
    onChange?.(files);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        width: '100%',
        aspectRatio: '3 / 2',
        border: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
      }}
    >
      <input {...getInputProps()} multiple />
      {isDragActive ? (
        <Text>Drop files here ...</Text>
      ) : (
        <Text>
          Drag and drop files here, or click to select files
          <br />
          {(() => {
            if (value.length === 0) {
              return null;
            }
            return (
              <>
                <Text>Current select files:</Text>
                <ul style={{ paddingLeft: 14 }}>
                  {value.map((item) => {
                    return (
                      <li key={item.name}>
                        <Text>{item.name}</Text>
                      </li>
                    );
                  })}
                </ul>
              </>
            );
          })()}
        </Text>
      )}
    </div>
  );
}
