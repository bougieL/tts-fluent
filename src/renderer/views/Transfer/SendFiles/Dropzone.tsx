import { useDropzone } from 'react-dropzone';
import { Text } from '@fluentui/react';
import { ipcRenderer } from 'electron';
import { IpcEvents } from 'const';

export interface File {
  name: string;
  path: string;
}

interface Props {
  value?: File[];
  onChange?: (files: File[]) => void;
}

export function Dropzone({ value = [], onChange }: Props) {
  const onDrop = (files: File[]) => {
    onChange?.(files);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });
  const handleClick = async () => {
    try {
      const { filePaths } = await ipcRenderer.invoke(
        IpcEvents.electronDialogShowOpenDialog,
        { properties: ['openFile', 'multiSelections'] }
      );
      const files = filePaths.map((item: string) => {
        return {
          path: item,
          name: item.split('/').pop(),
        };
      });
      onChange?.(files);
    } catch (error) {}
  };
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      {...getRootProps()}
      style={{
        width: 'calc(100vw - 360px)',
        height: 'calc(100vh - 370px)',
        // aspectRatio: '3 / 2',
        border: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
      }}
      onClick={handleClick}
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
                      <li key={item.path}>
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
