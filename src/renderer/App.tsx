import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { Badge, Stack, Tabs } from 'renderer/components';

import { Header, pathStorage } from './Views/Header';
import { mainRoutes, windowRoutes } from './Views/routes';
import { AudioProvider, useDownloadsNum, useVersion, Version } from './hooks';

import './App.scss';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const downloadsNum = useDownloadsNum();
  const { hasUpdate } = useVersion();

  const renderBadge = (index: number) => {
    if (index === mainRoutes.length - 2 && downloadsNum > 0) {
      return (
        <Badge sx={{ width: 16, height: 16 }} variant='filled' size='xs' p={0}>
          {downloadsNum}
        </Badge>
      );
    }
    if (index === mainRoutes.length - 1 && hasUpdate) {
      return (
        <Badge variant='filled' size='xs'>
          New
        </Badge>
      );
    }
    return null;
  };

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
