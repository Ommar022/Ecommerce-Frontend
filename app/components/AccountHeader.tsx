import { Group, Text } from '@mantine/core';
import { IconDots, IconShoppingBag, IconUser } from '@tabler/icons-react';

export function AccountHeader() {
  return (
    <Group justify="space-between" align="center" w="xl">
      {/* Logo - Left-aligned */}
      <Text fw={700} size="xl">
        eco-M
      </Text>

      {/* Navigation Links - Centered */}
      <Group gap="md" justify="center">
        <Text size="sm" color="dimmed">
          Shop
        </Text>
        <Text size="sm" color="dimmed">
          Collections
        </Text>
        <Text size="sm" color="dimmed">
          Explore
        </Text>
        <IconDots stroke={2} />
      </Group>

      {/* Cart & Account - Right-aligned */}
      <Group gap="md">
        <Group gap="xs">
          <IconShoppingBag />
          <Text size="sm" color="dimmed">
            Cart
          </Text>
        </Group>

        <Group gap="xs">
          <IconUser size={16} />
          <Text size="sm" color="dimmed">
            My account
          </Text>
        </Group>
      </Group>
    </Group>
  );
}
