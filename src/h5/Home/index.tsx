import { Link } from 'react-router-dom';
import { Button, Center, Stack } from '@mantine/core';

export default function Home() {
  return (
    <Center style={{ height: '100vh' }}>
      <Stack>
        <Link to='/badanmu'>
          <Button>Badanmu</Button>
        </Link>
        <Link to='/transfer'>
          <Button>Transfer</Button>
        </Link>
      </Stack>
    </Center>
  );
}
