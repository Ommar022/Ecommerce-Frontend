import { useState } from "react";
import { Card, Image, Text, Button, Group, Divider, Center } from "@mantine/core";
import axios from "axios";
import Cookies from "js-cookie";
import ReviewModal from "./ReviewModal"; // Import the ReviewModal component

interface Product {
  id: string;
  name: string;
  price: number;
  foodTypes: string[];
  attachments?: { id: string; base64Image: string }[];
}

interface ProductCardProps {
  product: Product;
  userRole: "admin" | "user";
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, userRole, onDelete }) => {
  const token = Cookies.get("token");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteProduct = async () => {
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      await axios.delete(`http://localhost:5010/api/Products/${product.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onDelete(product.id);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to delete product:", error.response?.data || error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius={4} w={300} m="sm">
        {product.attachments && product.attachments.length > 0 && (
          <Center w="100%">
            <Image
              src={product.attachments[0].base64Image}
              alt={product.name}
              height={200}
              fit="cover"
              radius={4}
              w="100%"
            />
          </Center>
        )}
        <Text ta="center" fw={500} mt="md">
          {product.name}
        </Text>
        <Text ta="center">Price: €{product.price}</Text>
        <Text ta="center">
          Food Types: {product.foodTypes.length > 0 ? product.foodTypes.join(", ") : "None"}
        </Text>
        <Divider my="sm" />
        {userRole === "admin" && (
          <Group w="100%" mb="md" justify="apart">
            <Button onClick={handleDeleteProduct} color="red" radius={8} size="sm">
              Delete
            </Button>
            <Button onClick={() => setIsModalOpen(true)} radius={8} size="sm">
              Review
            </Button>
          </Group>
        )}
        {userRole === "user" && (
          <Group w="100%" mb="md" gap="apart">
            <Button radius={8} size="sm">
              Order
            </Button>
            <Button onClick={() => setIsModalOpen(true)} radius={8} size="sm">
              Review
            </Button>
          </Group>
        )}
      </Card>

      <ReviewModal
        productId={product.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;
