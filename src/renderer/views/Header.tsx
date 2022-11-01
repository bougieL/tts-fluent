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

  const currentRoute = useMemo(() => {
    for (let i = 0; i < mainRoutes.length; i += 1) {
      const route = mainRoutes[i];
      if (matchPath(route.path, location.pathname)) {
        return {
          Icon: route.Icon,
          name: route.Component.displayName,
        };
      }
    }
    return {
      Icon: IconMenu2,
      name: 'Menu',
    };
  }, [location.pathname]);

  useAsync(async () => {
    navigate(pathStorage.get());
  }, []);

  return (
    <Group align='center' spacing='sm' className='header'>
      <Text size='sm'>TTS Fluent</Text>
      <Menu trigger='hover'>
        <Menu.Target>
          <Button
            variant='default'
            compact
            leftIcon={<currentRoute.Icon size={12} />}
          >
            {currentRoute.name}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {mainRoutes.map(({ path, Component, Icon }, index) => {
            return (
              <>
                {index === mainRoutes.length - 1 && <Menu.Divider />}
                <Menu.Item
                  component={Link}
                  to={path}
                  icon={<Icon size={14} />}
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
