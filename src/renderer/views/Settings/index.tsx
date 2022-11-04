import { FC } from 'react';

import AppVersion from './AppVersion';
import CheckUpdate from './CheckUpdate';
import Feedback from './FeedBack';
import ManagePlayCache from './ManagePlayCache';
import ThemePrefer from './ThemePrefer';
import TransferDirectory from './TransferDirectory';
import TTSDownloadsDirectory from './TTSDownloadsDirectory';

const Settings: FC = () => {
  return (
    <>
      <TTSDownloadsDirectory />
      <TransferDirectory />
      <ThemePrefer />
      <ManagePlayCache />
      <AppVersion />
      <Feedback />
      <CheckUpdate />
    </>
  );
};

Settings.displayName = 'Settings';

export default Settings;
