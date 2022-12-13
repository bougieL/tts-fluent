import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import BadanmuApp from './Badanmu';
import Home from './Home';
import { NotFound } from './NotFound';
import TransferApp from './Transfer';

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
  {
    path: '/*',
    element: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
