import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { App } from './App';

import 'react-toastify/dist/ReactToastify.css';

if (process.env.NODE_ENV === 'development') {
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
  <Router basename='/'>
    <App />
    <ToastContainer autoClose={3000} draggable={false} />
  </Router>
);
