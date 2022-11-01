import { useMemo } from 'react';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';

import { Button, Group, IconMenu2, Menu, Text } from 'renderer/components';
import { useAsync, useDownloadsNum, useVersion } from 'renderer/hooks';
import { createStorage } from 'renderer/lib';
import { AudioIndicator } from 'renderer/Widgets/AudioIndicator';

import { mainRoutes } from './routes';

const pathStorage = createStorage('__path__', '/');

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const downloadsNum = useDownloadsNum();
  const { hasUpdate } = useVersion();

  const pathName = useMemo(() => {
    for (let i = 0; i < mainRoutes.length; i += 1) {
      const { path, Component } = mainRoutes[i];
      if (matchPath(path, location.pathname)) {
        return Component.displayName;
      }
    }
    return 'Menu';
  }, [location.pathname]);

  useAsync(async () => {
    navigate(pathStorage.get());
  }, []);

  return (
    <Group align='center' spacing='sm' className='header'>
      <Text>TTS Fluent</Text>
      <Menu trigger='hover'>
        <Menu.Target>
          <Button variant='default' compact leftIcon={<IconMenu2 size={12} />}>
            {pathName}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {mainRoutes.map(({ path, Component }, index) => {
            return (
              <>
                {index === mainRoutes.length - 1 && <Menu.Divider />}
                <Menu.Item
                  component={Link}
                  to={path}
                  onClick={() => pathStorage.set(path)}
                >
                  {Component.displayName}
                </Menu.Item>
              </>
            );
          })}
        </Menu.Dropdown>
      </Menu>
      <AudioIndicator />
    </Group>
  );
};
