"use client";
import { Button, Group, Paper, Text, Title, Box, Container } from "@mantine/core";
import { AccountHeader } from "../components/AccountHeader";
import CategoryButton from "../components/CategoryButton";
import ProductCard from "../components/ProductCard";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { useMantineTheme } from "@mantine/core";
import AddressModal from "../components/AddressModal";

export default function UserPage() {
  const theme = useMantineTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const userRole = "user";

  const handleGetAllProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5010/api/Products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <AccountHeader />
      </Group>

      <Title order={1} mb="md" ta="center">
        Get Inspired
      </Title>

      <Text ta="center" lh={1.6} fw={600} fz="xl" mb="xl">
        Browsing for your next long-haul trip, everyday journey, or just fancy a look at what's new?
        From community favourites to about-to-sell-out items, see them all here.
      </Text>

      <Group justify="space-between" mb="xl">
        <Group gap="sm">
          <CategoryButton text="All Categories" />
          <CategoryButton text="All Colors" />
          <CategoryButton text="All Features" />
          <CategoryButton text="From$0 - $1000" />
        </Group>
        <CategoryButton text="New IN" />
      </Group>

      <Box ta="center" mb="xl">
        <Button onClick={() => setAddressModalOpen(true)} radius="md" variant="outline" size="md">
          Address
        </Button>
      </Box>

      <Box ta="center" mb="xl">
        <Button onClick={handleGetAllProducts} radius="md" variant="outline" size="md">
          Get All Products
        </Button>
      </Box>

      {products.length > 0 && (
        <Paper shadow="xs" p="md" mt="xl" radius="md">
          <Title order={3} mb="md" ta="center">
            All Products
          </Title>
          <Group justify="center" gap="xl" wrap="wrap">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                userRole={userRole}
                onUpdate={(id) => console.log("Update product:", id)}
                onDelete={(id) => console.log("Delete product:", id)}
              />
            ))}
          </Group>
        </Paper>
      )}

      <AddressModal opened={addressModalOpen} onClose={() => setAddressModalOpen(false)} />
    </Container>
  );
}