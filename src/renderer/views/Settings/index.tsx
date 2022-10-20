import AppVersion from './AppVersion';
import CheckUpdate from './CheckUpdate';
import Feedback from './FeedBack';
import ManagePlayCache from './ManagePlayCache';
import TransferDirectory from './TransferDirectory';
import TTSDownloadsDirectory from './TTSDownloadsDirectory';

const Settings = () => {
  return (
    <>
      <TTSDownloadsDirectory />
      <TransferDirectory />
      <ManagePlayCache />
      <AppVersion />
      <Feedback />
      <CheckUpdate />
    </>
  );
};

export default Settings;
