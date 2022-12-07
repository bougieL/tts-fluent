import { createRoot } from 'react-dom/client';

import App from './App';

if (process.env.NODE_ENV === 'development') {
  //   import('vconsole').then(({ default: VConsole }) => new VConsole()).catch();
  document.body.style.backgroundImage = `url(https://picsum.photos/360/640?t=${Date.now()}`;
  document.body.style.backgroundSize = 'cover';
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
