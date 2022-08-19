import AppVersion from './AppVersion';
import CheckUpdate from './CheckUpdate';
import TTSDownloadsDirectory from './TTSDownloadsDirectory';
import Feedback from './FeedBack';
import ManagePlayCache from './ManagePlayCache';
import TransferDirectory from './TransferDirectory';

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
