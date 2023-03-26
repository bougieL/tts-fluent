import { useNavigate } from 'react-router-dom';
import { Button, Center, Stack, Text } from '@mantine/core';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Center style={{ height: '100vh' }}>
      <Stack spacing='md'>
        <Text size='lg'>Unmatched path</Text>
        <Button
          onClick={() => {
            navigate('/');
          }}
        >
          Go Home
        </Button>
      </Stack>
    </Center>
  );
}
