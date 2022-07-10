import {
  MemoryRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Pivot, PivotItem, Stack } from '@fluentui/react';
import MicrosoftTTS from './views/MicrosoftTTS';
import Settings from './views/Settings';
import './App.scss';
import Histories from './views/Histories';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handlePivotClick = (item?: PivotItem) => {
    navigate(item?.props.itemKey || '/');
  };
  return (
    <>
      <Stack styles={{ root: { height: 36 } }} className="header" />
      <Stack tokens={{ childrenGap: 18 }} className="main">
        <Pivot
          selectedKey={location.pathname}
          onLinkClick={handlePivotClick}
          styles={{ text: { fontSize: 24 } }}
          linkFormat="tabs"
        >
          <PivotItem headerText="Microsoft TTS" itemKey="/" />
          <PivotItem headerText="Histories" itemKey="/histories" />
          <PivotItem headerText="Settings" itemKey="/settings" />
        </Pivot>
        <Routes>
          <Route path="/" element={<MicrosoftTTS />} />
          <Route path="/histories" element={<Histories />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Stack>
    </>
  );
};

export default () => {
  return (
    <Router>
      <App />
    </Router>
  );
};
