import AppVersion from './AppVersion';
import CheckUpdate from './CheckUpdate';
import DownloadsDirectory from './DownloadsDirectory';
import Feedback from './FeedBack';
import ManagePlayCache from './ManagePlayCache';

const Settings = () => {
  return (
    <>
      <DownloadsDirectory />
      <ManagePlayCache />
      <AppVersion />
      <Feedback />
      <CheckUpdate />
    </>
  );
};

export default Settings;
