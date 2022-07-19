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
import './App.scss';
import Downloads from './Views/Downloads';
import { AudioProvider, useDownloadsNum } from './hooks';
import { AudioIndicator } from './Widgets/AudioIndicator';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const downloadsNum = useDownloadsNum();
  const handlePivotClick = (item?: PivotItem) => {
    navigate(item?.props.itemKey || '/');
  };
  const downloadsText =
    downloadsNum > 0 ? `Downloads(${downloadsNum})` : 'Downloads';
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
            styles={{ text: { fontSize: 24 } }}
            linkFormat="tabs"
          >
            <PivotItem headerText="Microsoft TTS" itemKey="/" />
            <PivotItem headerText={downloadsText} itemKey="/downloads" />
            <PivotItem headerText="Settings" itemKey="/settings" />
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
        <App />
      </AudioProvider>
    </Router>
  );
};
