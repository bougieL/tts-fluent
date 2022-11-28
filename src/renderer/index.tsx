import { createRoot } from 'react-dom/client';

import App from './App';

import 'lib/log';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

if (/win/i.test(navigator.userAgent)) {
  document.body.setAttribute('data-platform', 'windows');
}
