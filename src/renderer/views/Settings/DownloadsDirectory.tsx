import { TextField } from '@fluentui/react';
import { useEffect, useState } from 'react';
import { useAsync } from 'react-use';

const DownloadsDirectory = () => {
  // return <input type="file" webkitdirectory />;
  const [path, setPath] = useState('');
  const handleSetFilePath = async () => {
    const paths = await window.electron.dialog.showOpenDialogSync({
      properties: ['openDirectory'],
    });
    if (paths?.[0]) {
      setPath(paths[0]);
    }
  };
  useAsync(async () => {
    const downloadsPath = await window.electron.app.getPath('downloads');
    setPath(downloadsPath);
  }, []);
  return (
    <TextField
      label="Downloads Directory"
      type="button"
      value={path}
      onClick={handleSetFilePath}
      style={{ textAlign: 'left' }}
      // onRenderLabel={onWrapDefaultLabelRenderer}
    />
  );
};

export default DownloadsDirectory;
