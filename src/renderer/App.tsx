import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Stack, Tabs } from '@mantine/core';

import { Header, pathStorage, useRenderBadge } from './Views/Header';
import { mainRoutes, windowRoutes } from './Views/routes';
import { AudioProvider, Version } from './hooks';

import './App.scss';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const renderBadge = useRenderBadge();

  return (
    <>
      <Header />
      <Stack className='main' spacing='xs'>
        <Tabs
          value={location.pathname}
          onTabChange={(value: string) => {
            navigate(value);
            pathStorage.set(value);
          }}
        >
          <Tabs.List>
            {mainRoutes.map(({ path, Component, Icon }, index) => {
              return (
                <Tabs.Tab
                  value={path}
                  key={path}
                  icon={<Icon size={16} />}
                  rightSection={renderBadge(index)}
                >
                  {Component.displayName}
                </Tabs.Tab>
              );
            })}
          </Tabs.List>
        </Tabs>
        <Routes>
          {mainRoutes.map(({ path, Component }) => {
            return <Route path={path} key={path} element={<Component />} />;
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
            <Route path='/window'>
              {windowRoutes.map(({ path, Component }) => {
                return <Route path={path} key={path} element={<Component />} />;
              })}
            </Route>
            <Route path='/*' element={<App />} />
          </Routes>
        </Version>
      </AudioProvider>
    </Router>
  );
};
