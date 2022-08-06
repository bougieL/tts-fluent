import { createRoot } from 'react-dom/client';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { HashRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { isDev } from 'lib/utils';
import { App } from './App';
import 'react-toastify/dist/ReactToastify.css';

initializeIcons();

if (isDev) {
  import('vconsole')
    .then((res) => {
      const VConsole = res.default;
      return new VConsole();
    })
    .catch();
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <Router basename="/">
    <App />
    <ToastContainer autoClose={3000} draggable={false} />
  </Router>
);
