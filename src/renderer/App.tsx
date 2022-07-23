import {
  MemoryRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Pivot, PivotItem, Stack } from '@fluentui/react';
import MicrosoftTTS from './Views/MicrosoftTTS';
import Settings from './Views/Settings';
import Downloads from './Views/Downloads';
import { AudioProvider, Version, useDownloadsNum, useVersion } from './hooks';
import { AudioIndicator } from './Widgets/AudioIndicator';
import './App.scss';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const downloadsNum = useDownloadsNum();
  const { hasUpdate } = useVersion();
  const handlePivotClick = (item?: PivotItem) => {
    navigate(item?.props.itemKey || '/');
  };
  return (
    <>
      <Stack styles={{ root: { height: 36 } }} className="header" />
      <Stack tokens={{ childrenGap: 18 }} className="main">
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
        >
          <Pivot
            selectedKey={location.pathname}
            onLinkClick={handlePivotClick}
            styles={{ text: { fontSize: 18 }, count: { fontSize: 16 }, }}
            // linkFormat="tabs"
          >
            <PivotItem headerText="Microsoft TTS" itemKey="/" />
            <PivotItem
              headerText="Downloads"
              itemKey="/downloads"
              itemCount={downloadsNum || undefined}
            />
            <PivotItem
              headerText="Settings"
              itemKey="/settings"
              itemCount={hasUpdate ? 'New version!' : undefined}
            />
          </Pivot>
          <AudioIndicator />
        </Stack>
        <Routes>
          <Route path="/" element={<MicrosoftTTS />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Stack>
    </>
  );
};

export default () => {
  return (
    <Router>
      <AudioProvider>
        <Version>
          <App />
        </Version>
      </AudioProvider>
    </Router>
  );
};
