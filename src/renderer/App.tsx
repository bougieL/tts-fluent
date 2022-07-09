import {
  MemoryRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Pivot, PivotItem } from '@fluentui/react';
import MicrosoftTTS from './views/MicrosoftTTS';
import Settings from './views/Settings';
import './App.scss';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handlePivotClick = (item?: PivotItem) => {
    navigate(item?.props.itemKey || '/');
  };
  return (
    <>
      <Pivot selectedKey={location.pathname} onLinkClick={handlePivotClick}>
        <PivotItem headerText="Microsoft TTS" itemKey="/" />
        <PivotItem headerText="Settings" itemKey="/settings" />
      </Pivot>
      <Routes>
        <Route path="/" element={<MicrosoftTTS />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
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
