import { createRoot } from 'react-dom/client';

import App from './App';

import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
