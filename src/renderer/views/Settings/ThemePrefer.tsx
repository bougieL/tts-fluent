import { Box, Center, Group, Input, SegmentedControl } from '@mantine/core';
import { IconBrightnessHalf, IconMoon, IconSun } from '@tabler/icons';

import { ThemeVariant, useThemeVariant } from 'renderer/components';

const ThemePrefer = () => {
  const [themeVariant, setThemeVariant] = useThemeVariant();

  return (
    <Input.Wrapper label='Theme'>
      <Group>
        <SegmentedControl
          value={themeVariant}
          onChange={setThemeVariant}
          data={[
            {
              value: ThemeVariant.system,
              label: (
                <Center>
                  <IconBrightnessHalf size={16} />
                  <Box ml={10}>System</Box>
                </Center>
              ),
            },
            {
              value: ThemeVariant.light,
              label: (
                <Center>
                  <IconSun size={16} />
                  <Box ml={10}>Light</Box>
                </Center>
              ),
            },
            {
              value: ThemeVariant.dark,
              label: (
                <Center>
                  <IconMoon size={16} />
                  <Box ml={10}>Dark</Box>
                </Center>
              ),
            },
          ]}
        />
      </Group>
    </Input.Wrapper>
  );
};

export default ThemePrefer;
