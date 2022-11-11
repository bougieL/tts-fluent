import { Group, Text } from '@mantine/core';

export const Header = () => {
  return (
    <Group align='center' spacing='sm' className='header'>
      <Text size='sm' ml={12} weight='bold' className='title'>
        TTS Fluent
      </Text>
    </Group>
  );
};
