import { createRoot } from 'react-dom/client';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import App from './App';

initializeIcons();

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
