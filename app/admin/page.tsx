"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Stepper,
  TextInput,
  NumberInput,
  Button,
  Group,
  Paper,
  Title,
  FileInput,
  Text,
  LoadingOverlay,
  Divider,
  Alert,
  useMantineTheme,
  MantineProvider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconBox,
  IconCheck,
  IconTags,
  IconUpload,
  IconPhoto,
} from "@tabler/icons-react";
import ProductCard from "../components/ProductCard";

const AdminPage = () => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [foodTypes, setFoodTypes] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Style definitions
  const containerStyle = {
    backgroundColor: theme.colors.gray[2],
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.xl,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    width: "100%",
    textAlign: "center",
  };

  const titleStyle = {
    fontFamily: "Greycliff CF, sans-serif",
    color: theme.colors.blue[6],
    marginBottom: theme.spacing.xl,
  };

  const stepperStyle = {
    width: "100%",
    marginTop: theme.spacing.md,
  };

  const formControlStyle = {
    marginTop: theme.spacing.sm,
  };

  // Verify admin status
  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    if (!token || role !== "admin") router.push("/");
  }, [router]);

  // Product form
  const productForm = useForm({
    initialValues: {
      name: "",
      price: 0,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      price: (value) => (value <= 0 ? "Price must be greater than 0" : null),
    },
  });

  // Handle product creation
  const handleProductSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5010/api/Products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(productForm.values),
      });

      if (!response.ok) throw new Error("Failed to create product");

      const data = await response.json();
      setProductId(data.id);
      setActiveStep(1);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  // Handle food type creation
  const handleFoodTypesSubmit = async () => {
    if (!productId) return;

    setLoading(true);
    try {
      await Promise.all(
        foodTypes.map(async (type) => {
          const response = await fetch("http://localhost:5010/api/FoodTypes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify({
              productId,
              name: type,
            }),
          });
          if (!response.ok) throw new Error("Failed to create food type");
        })
      );
      setActiveStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create food types");
    } finally {
      setLoading(false);
    }
  };

  // Handle image uploads
  const handleImageUpload = async () => {
    if (!productId) return;

    setLoading(true);
    try {
      await Promise.all(
        uploadedImages.map(async (base64Image) => {
          const response = await fetch("http://localhost:5010/api/Attachments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify({
              productId,
              base64Image,
            }),
          });
          if (!response.ok) throw new Error("Failed to upload image");
        })
      );
      setSuccess(true);
      setTimeout(() => router.push("/admin"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  // Handle image file conversion
  const handleFileUpload = (files: File[]) => {
    const readers = files.map((file) =>
      new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      })
    );

    Promise.all(readers).then(setUploadedImages);
  };

  // Fetch all products
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
    <MantineProvider theme={theme}>
      <Group style={{containerStyle}} align="center" justify="center">
        <LoadingOverlay visible={loading} />

        <Title style={titleStyle} order={1}>
          Admin Dashboard
        </Title>

        <Stepper style={stepperStyle} active={activeStep}>
          <Stepper.Step label="Product Details" icon={<IconBox size={18} />}>
            <form onSubmit={productForm.onSubmit(handleProductSubmit)}>
              <TextInput
                label="Product Name"
                placeholder="Enter product name"
                {...productForm.getInputProps("name")}
                mb="md"
                style={formControlStyle}
              />

              <NumberInput
                label="Price"
                placeholder="Enter price"
                min={0}
                {...productForm.getInputProps("price")}
                mb="md"
                style={formControlStyle}
              />

              <Group justify="center" gap="xl">
                <Button
                  type="submit"
                  color="blue"
                  leftSection={<IconCheck size={16} />}
                >
                  Create Product
                </Button>
              </Group>
            </form>
          </Stepper.Step>

          <Stepper.Step label="Food Types" icon={<IconTags size={18} />}>
            <div>
              <Text size="sm" mb="md" color="dimmed">
                Add food types for this product:
              </Text>

              <TextInput
                placeholder="Add food types (comma separated)"
                value={foodTypes.join(", ")}
                onChange={(e) =>
                  setFoodTypes(e.target.value.split(",").map((type) => type.trim()))
                }
                mb="md"
                style={formControlStyle}
              />

              <Group justify="center" gap="xl">
                <Button
                  variant="default"
                  onClick={() => setActiveStep(0)}
                  leftSection={<IconArrowLeft size={16} />}
                >
                  Back
                </Button>
                <Button
                  color="orange"
                  onClick={handleFoodTypesSubmit}
                  leftSection={<IconCheck size={16} />}
                >
                  Save Food Types
                </Button>
              </Group>
            </div>
          </Stepper.Step>

          <Stepper.Step label="Images" icon={<IconPhoto size={18} />}>
            <div>
              <FileInput
                label="Upload Product Images"
                placeholder="Select images"
                accept="image/*"
                multiple
                leftSection={<IconUpload size={14} />}
                onChange={handleFileUpload}
                mb="md"
              />

              <Group justify="center" gap="xl">
                <Button
                  variant="default"
                  onClick={() => setActiveStep(1)}
                  leftSection={<IconArrowLeft size={16} />}
                >
                  Back
                </Button>
                <Button
                  color="green"
                  onClick={handleImageUpload}
                  leftSection={<IconUpload size={16} />}
                >
                  Finish & Upload
                </Button>
              </Group>
            </div>
          </Stepper.Step>
        </Stepper>

        <Divider my="xl" />

        {error && (
          <Alert color="red" title="Error" onClose={() => setError(null)} mb="md">
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="teal" title="Success" onClose={() => setSuccess(false)} mb="md">
            Operation completed successfully!
          </Alert>
        )}

        <Group justify="center">
          <Button onClick={handleGetAllProducts} mt="md">
            Get All Products
          </Button>
        </Group>

        {products.length > 0 && (
          <Paper shadow="xs" p="md" mt="xl">
            <Title order={3} mb="md">
              All Products
            </Title>
            <Group justify="center" gap="xl">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  userRole="admin"
                  onUpdate={(id) => console.log("Update product:", id)}
                  onDelete={(id) => console.log("Delete product:", id)}
                />
              ))}
            </Group>
          </Paper>
        )}
      </Group>
    </MantineProvider>
  );
};

export default AdminPage;