import AppVersion from './AppVersion';
import CheckUpdate from './CheckUpdate';
import TTSDownloadsDirectory from './TTSDownloadsDirectory';
import Feedback from './FeedBack';
import ManagePlayCache from './ManagePlayCache';

const Settings = () => {
  return (
    <>
      <TTSDownloadsDirectory />
      <ManagePlayCache />
      <AppVersion />
      <Feedback />
      <CheckUpdate />
    </>
  );
};

export default Settings;
