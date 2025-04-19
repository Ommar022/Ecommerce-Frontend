import { Button, Menu, rem, Group, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

interface CategoryButtonProps {
  text: string;
}

export default function CategoryButton({ text }: CategoryButtonProps) {
  return (
    <Menu>
      <Menu.Target>
        <Button variant="outline" radius="xl" size="lg">
          <Group gap="xs" align="center" > {/* {noWarp} */}
            <Text fw={700} size={rem(14)}>
              {text}
            </Text>
            <IconChevronDown size={16} />
          </Group>
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Option 1</Menu.Item>
        <Menu.Item>Option 2</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
