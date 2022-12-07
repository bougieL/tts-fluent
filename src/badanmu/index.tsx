import { createRoot } from 'react-dom/client';

import App from './App';

if (process.env.NODE_ENV === 'development') {
  //   import('vconsole').then(({ default: VConsole }) => new VConsole()).catch();
  // document.body.style.removeProperty('background-color');
  // document.body.style.removeProperty('background');
  document.body.style.setProperty(
    'background-image',
    `url(https://picsum.photos/360/640?t=${Date.now()})`,
    'important'
  );
  document.body.style.setProperty('background-size', 'cover');
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
