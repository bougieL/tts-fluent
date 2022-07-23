import AppVersion from './AppVersion';
// import CheckUpdate from './CheckUpdate';
import DownloadsDirectory from './DownloadsDirectory';
import ManagePlayCache from './ManagePlayCache';

const Settings = () => {
  return (
    <>
      <DownloadsDirectory />
      <ManagePlayCache />
      <AppVersion />
      {/* <CheckUpdate /> */}
    </>
  );
};

export default Settings;
