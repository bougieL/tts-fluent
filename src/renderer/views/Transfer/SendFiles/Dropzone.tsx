import { useDropzone } from 'react-dropzone';
import { ipcRenderer } from 'electron';
import { Box, Text, useMantineTheme } from '@mantine/core';

import { IpcEvents } from 'const';

export interface File {
  name: string;
  path: string;
  size: number;
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
  const { colors, colorScheme } = useMantineTheme();

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <Box
      {...getRootProps()}
      style={{
        width: 'calc(100vw - 290px)',
        height: 'calc(100vh - 340px)',
        border: '1px solid #ccc',
        borderColor: colorScheme === 'light' ? colors.gray[4] : colors.gray[8],
        backgroundColor: colorScheme === 'light' ? undefined : colors.dark[6],
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        textAlign: 'left',
        borderRadius: 4,
      }}
      onClick={handleClick}
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
    </Box>
  );
}
