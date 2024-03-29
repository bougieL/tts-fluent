import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Group, Stack, Tabs } from '@mantine/core';

import { ConfigCache } from 'caches';

import { ForceUpdate } from './components/ForceUpdate';
import { Header } from './components/Header';
import { useRenderBadge } from './hooks/useRenderBadge';
import { BadanmuFloatWindow } from './Views/Badanmu/FloatWindow';
import { NotFound, NotFoundWindow } from './Views/NotFound';
import { mainRoutes, windowRoutes } from './Views/routes';
import { AudioIndicator } from './Widgets/AudioIndicator';
import { ThemeProvider } from './components';
import { AudioProvider, VersionProvider } from './hooks';

import './App.scss';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const renderBadge = useRenderBadge();

  return (
    <>
      <Header />
      <ForceUpdate />
      <Stack className='main' spacing='xs'>
        <Tabs
          variant='pills'
          value={location.pathname}
          onTabChange={(value: string) => {
            navigate(value);
            ConfigCache.write(ConfigCache.Key.route, value);
          }}
        >
          <Group position='apart' align='center'>
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
            <AudioIndicator />
          </Group>
        </Tabs>
        <Routes>
          {mainRoutes.map(({ path, Component }) => {
            return <Route path={path} key={path} element={<Component />} />;
          })}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Stack>
    </>
  );
};

export default () => {
  // return null;
  return (
    <Router>
      <ThemeProvider>
        <AudioProvider>
          <VersionProvider>
            <Routes>
              <Route path='/window'>
                {windowRoutes.map(({ path, Component }) => {
                  return (
                    <Route path={path} key={path} element={<Component />} />
                  );
                })}
                <Route path='*' element={<NotFoundWindow />} />
              </Route>
              <Route path='/badanmu-float' element={<BadanmuFloatWindow />} />
              <Route path='/*' element={<App />} />
            </Routes>
          </VersionProvider>
        </AudioProvider>
      </ThemeProvider>
    </Router>
  );
};
