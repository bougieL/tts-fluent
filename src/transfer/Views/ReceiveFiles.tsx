import { useState } from 'react';
import {
  Icon,
  Label,
  Link,
  List,
  Separator,
  Stack,
  Text,
} from 'transfer/components';
import { humanFileSize } from 'lib/humanFileSize';
import { toast } from 'react-toastify';
import { useReceiveFiles, useServer } from 'transfer/hooks';

export function ReceiveFiles() {
  const server = useServer();

  const [files, setFiles] = useState<
    Array<{ name: string; download: string; size: number }>
  >([]);

  useReceiveFiles({
    onReceiveManualFiles(files) {
      toast.info(
        <>
          <Text>Receive files from {server?.serverName}</Text>
          <br />
          <Text variant="small">
            {files.length === 1
              ? 'Your browser doesn‘t support auto download'
              : 'Doesn‘t support auto download multi files'}
            , please download manually
          </Text>
        </>,
        {
          autoClose: false,
        }
      );
      setFiles(files);
    },
  });

  if (files.length === 0) {
    return null;
  }

  return (
    <Stack>
      <Stack horizontal horizontalAlign="space-between">
        <Label>Receive files</Label>
        <Link
          href="##"
          onClick={(event) => {
            event.preventDefault();
            setFiles([]);
          }}
        >
          Clear
        </Link>
      </Stack>
      <List
        items={files}
        getKey={(item) => item.download}
        onRenderCell={(item) => {
          return (
            <>
              <Link download={item!.name} href={item!.download}>
                <Stack
                  horizontal
                  horizontalAlign="space-between"
                  verticalAlign="center"
                  styles={{ root: { paddingTop: 4, paddingBottom: 4 } }}
                  tokens={{ childrenGap: 12 }}
                >
                  <Text variant="medium">{item!.name}</Text>
                  <Stack
                    horizontal
                    horizontalAlign="end"
                    verticalAlign="center"
                    tokens={{ childrenGap: 12 }}
                  >
                    <Text variant="medium" style={{ whiteSpace: 'nowrap' }}>
                      {humanFileSize(item!.size)}
                    </Text>
                    <Icon iconName="download" />
                  </Stack>
                </Stack>
              </Link>
              <Separator />
            </>
          );
        }}
      />
    </Stack>
  );
}
