import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { Pivot, PivotItem, Stack } from 'renderer/components';

import Downloads from './Views/Downloads';
import Markdown from './Views/Markdown';
import MicrosoftTTS from './Views/MicrosoftTTS';
import Settings from './Views/Settings';
import Transfer from './Views/Transfer';
import TTSCat from './Views/TTSCat';
import TTSCatEditor from './Views/TTSCatEditor';
import { AudioIndicator } from './Widgets/AudioIndicator';
import {
  AudioProvider,
  useAsync,
  useDownloadsNum,
  useVersion,
  Version,
} from './hooks';
import { createStorage } from './lib';

import './App.scss';

const pathStorage = createStorage('__path__', '/');

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const downloadsNum = useDownloadsNum();
  const { hasUpdate } = useVersion();
  const handlePivotClick = (item?: PivotItem) => {
    const path = item?.props.itemKey || '/';
    navigate(path);
    pathStorage.set(path);
  };
  useAsync(async () => {
    navigate(pathStorage.get());
  }, []);
  return (
    <Stack tokens={{ childrenGap: 12 }} className="main">
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Pivot
          selectedKey={location.pathname}
          onLinkClick={handlePivotClick}
          styles={{
            text: { fontSize: 16 },
            count: { fontSize: 16 },
            link: { height: 32 },
          }}
          // linkFormat="tabs"
        >
          <PivotItem headerText="Microsoft TTS" itemKey="/" />
          <PivotItem headerText="TTS Cat" itemKey="/ttsCat" />
          <PivotItem headerText="Transfer" itemKey="/transfer" />
          <PivotItem
            headerText="Downloads"
            itemKey="/downloads"
            itemCount={downloadsNum || undefined}
          />
          <PivotItem
            headerText="Settings"
            itemKey="/settings"
            itemCount={hasUpdate ? '🤡 New version !' : undefined}
          />
        </Pivot>
        <AudioIndicator />
      </Stack>
      <Routes>
        <Route path="" element={<MicrosoftTTS />} />
        <Route path="ttsCat" element={<TTSCat />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="downloads" element={<Downloads />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </Stack>
  );
};

export default () => {
  return (
    <Router>
      <AudioProvider>
        <Version>
          <Stack styles={{ root: { height: 36 } }} className="header" />
          <Routes>
            <Route path="/window">
              <Route path="markdown" element={<Markdown />} />
              <Route path="ttsCatEditor" element={<TTSCatEditor />} />
            </Route>
            <Route path="/*" element={<App />} />
          </Routes>
        </Version>
      </AudioProvider>
    </Router>
  );
};
