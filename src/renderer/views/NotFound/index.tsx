import { Button, Center, Stack, Text } from '@mantine/core';

export function NotFound({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <Center>
      <Stack spacing='md'>
        <Text size='lg'>Unmatched path</Text>
        <Button onClick={onClick}>{text}</Button>
      </Stack>
    </Center>
  );
}
