import { useNavigate } from 'react-router-dom';
import { Button, Center, Stack, Text } from '@mantine/core';

import { ConfigCache } from 'caches';

interface Props {
  text: string;
  onClick: () => void;
}

function NotFoundBase({ text, onClick }: Props) {
  return (
    <Center>
      <Stack spacing='md'>
        <Text size='lg'>Unmatched path</Text>
        <Button onClick={onClick}>{text}</Button>
      </Stack>
    </Center>
  );
}

export function NotFound() {
  const navigate = useNavigate();

  return (
    <NotFoundBase
      text='Go home'
      onClick={() => {
        navigate('/');
        ConfigCache.write(ConfigCache.Key.route, '/');
      }}
    />
  );
}

export function NotFoundWindow() {
  return (
    <NotFoundBase
      text='Close window'
      onClick={() => {
        window.close();
      }}
    />
  );
}
