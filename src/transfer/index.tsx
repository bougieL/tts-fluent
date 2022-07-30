import { createRoot } from 'react-dom/client';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { HashRouter as Router } from 'react-router-dom';
import { App } from './App';

initializeIcons();

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <Router basename="/">
    <App />
  </Router>
);
