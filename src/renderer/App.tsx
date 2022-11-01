import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import { Stack } from 'renderer/components';

import { Header } from './Views/Header';
import { mainRoutes, windowRoutes } from './Views/routes';
import { AudioProvider, Version } from './hooks';

import './App.scss';

const App = () => {
  return (
    <>
      <Header />
      <Stack className="main">
        <Routes>
          {mainRoutes.map(({ path, Component }) => {
            return <Route path={path} element={<Component />} />;
          })}
        </Routes>
      </Stack>
    </>
  );
};

export default () => {
  return (
    <Router>
      <AudioProvider>
        <Version>
          <Routes>
            <Route path="/window">
              {windowRoutes.map(({ path, Component }) => {
                return <Route path={path} element={<Component />} />;
              })}
            </Route>
            <Route path="/*" element={<App />} />
          </Routes>
        </Version>
      </AudioProvider>
    </Router>
  );
};
