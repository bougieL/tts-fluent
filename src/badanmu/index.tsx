import { createRoot } from 'react-dom/client';

import App from './App';

import 'react-toastify/dist/ReactToastify.css';

if (process.env.NODE_ENV === 'development') {
  import('vconsole').then(({ default: VConsole }) => new VConsole()).catch();
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
