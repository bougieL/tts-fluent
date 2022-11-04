import { useMemo } from 'react';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { useAsync } from 'react-use';
import { Badge, Button, Group, Menu, Text } from '@mantine/core';

import { useDownloadsNum, useVersion } from 'renderer/hooks';
import { createStorage } from 'renderer/lib';
import { AudioIndicator } from 'renderer/Widgets/AudioIndicator';

import { mainRoutes } from './routes';

// import { mainRoutes } from './routes';

export const pathStorage = createStorage('__path__', '/');

export const Header = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  // const downloadsNum = useDownloadsNum();
  // const { hasUpdate } = useVersion();

  // const currentRoute = useMemo(() => {
  //   for (let i = 0; i < mainRoutes.length; i += 1) {
  //     const route = mainRoutes[i];
  //     if (matchPath(route.path, location.pathname)) {
  //       return {
  //         Icon: route.Icon,
  //         name: route.Component.displayName,
  //       };
  //     }
  //   }
  //   return {
  //     Icon: IconMenu2,
  //     name: 'Menu',
  //   };
  // }, [location.pathname]);

  useAsync(async () => {
    navigate(pathStorage.get());
  }, []);

  return (
    <Group align='center' spacing='sm' className='header'>
      {/* <Text size='sm'>TTS Fluent</Text>
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
      </Menu> */}
      {/* <AudioIndicator /> */}
    </Group>
  );
};

export function useRenderBadge() {
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

  return renderBadge;
}
