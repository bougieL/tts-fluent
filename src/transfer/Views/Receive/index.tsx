import { Label, Stack } from '@fluentui/react';
import { useState } from 'react';

const globalState: { files: File[] } = { files: [] };

interface ReceiveProps {
  // disabled?: boolean;
}

export function Receive({}: ReceiveProps) {
  const [files, setStateFiles] = useState(globalState.files);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Label styles={{ root: { fontSize: 24 } }}>Receive</Label>
      <Stack tokens={{ childrenGap: 24 }}></Stack>
    </>
  );
}
