import { createRoot } from 'react-dom/client';

import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

if (navigator.userAgent.includes('Win')) {
  document.body.setAttribute('data-platform', 'windows');
}
