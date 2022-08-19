import { useDropzone } from 'react-dropzone';
import { Text } from 'transfer/components';

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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
      }}
    >
      <input {...getInputProps()} multiple />
      {isDragActive ? (
        <Text>Drop files here ...</Text>
      ) : (
        <>
          <Text
            style={{
              display: 'block',
              width: '100%',
              textAlign: value.length > 0 ? 'left' : 'center',
            }}
          >
            Drag and drop files here, or click to select files
            <br />
            {value.length > 0 && 'Current selected files:'}
          </Text>
          {(() => {
            if (value.length === 0) {
              return null;
            }
            return (
              <ul
                style={{
                  paddingLeft: 18,
                  overflow: 'overlay',
                  width: '100%',
                }}
              >
                {value.map((item) => {
                  return (
                    <li key={item.path}>
                      <Text>{item.name}</Text>
                    </li>
                  );
                })}
              </ul>
            );
          })()}
        </>
      )}
    </div>
  );
}
