import { Badge } from '@mantine/core';

import { useDownloadsNum, useVersion } from 'renderer/hooks';
import { mainRoutes } from 'renderer/Views/routes';

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
