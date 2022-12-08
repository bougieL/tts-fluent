import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import BadanmuApp from './Badanmu/App';
import TransferApp from './Transfer/App';
import Home from './Home';

import './App.scss';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/badanmu',
    element: <BadanmuApp />,
  },
  {
    path: '/transfer',
    element: <TransferApp />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
