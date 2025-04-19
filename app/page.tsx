"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  TextInput,
  Button,
  Group,
  Paper,
  Title,
  Divider,
  Notification,
  Stack,
  Box,
} from "@mantine/core";

const Home = () => {
  const router = useRouter();
  const [action, setAction] = useState<"Sign Up" | "Login">("Sign Up");
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const url = action === "Sign Up" 
      ? "http://localhost:5010/api/User/signup" 
      : "http://localhost:5010/api/User/login";

    const payload = action === "Sign Up"
      ? formData
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || `${action} failed`);

      if (result.token) {
        Cookies.set("token", result.token);
        Cookies.set("userId", result.user.id);
        Cookies.set("role", result.role);
        router.push(result.role === "admin" ? "/admin" : "/user");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  return (
    <Group justify="center" align="center" h="100vh" bg="gray.2">
      <Paper shadow="md" p="lg" radius="md" w={380} bg="white">
        <Stack gap="md">
          <Title order={2} ta="center" c="dark">
            {action}
          </Title>

          <Divider color="gray.4" />

          <Stack gap="sm">
            {action === "Sign Up" && (
              <TextInput
                label="Username"
                placeholder="Enter your username"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
              />
            )}

            <TextInput
              label="Email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />

            <TextInput
              label="Password"
              placeholder="Enter your password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </Stack>

          {error && (
            <Notification color="red" title="Error" onClose={() => setError(null)}>
              {error}
            </Notification>
          )}

          <Group justify="center" gap="sm">
            <Button
              variant={action === "Sign Up" ? "filled" : "outline"}
              color="violet"
              radius="md"
              onClick={() => {
                setAction("Sign Up");
                setError(null);
              }}
            >
              Sign Up
            </Button>
            
            <Button
              variant={action === "Login" ? "filled" : "outline"}
              color="violet"
              radius="md"
              onClick={() => {
                setAction("Login");
                setError(null);
              }}
            >
              Login
            </Button>
          </Group>

          <Button
            fullWidth
            color="violet"
            radius="md"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Stack>
      </Paper>
    </Group>
  );
};

export default Home;