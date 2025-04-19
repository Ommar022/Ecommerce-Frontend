"use client";
import {
  Button,
  Group,
  Paper,
  Text,
  Title,
  Box,
  Container,
  Modal,
  TextInput,
} from "@mantine/core";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { AccountHeader } from "../components/AccountHeader";
import CategoryButton from "../components/CategoryButton";
import ProductCard from "../components/ProductCard";

// Define types for AddressModal props
interface AddressModalProps {
  opened: boolean;
  onClose: () => void;
}

// Define address type with optional `id`
interface Address {
  id?: number; // Ensure `id` is optional to avoid errors
  street: string;
  city: string;
}

function AddressModal({ opened, onClose }: AddressModalProps) {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch user address
  useEffect(() => {
    if (opened) {
      fetchUserAddress();
    }
  }, [opened]);

  const fetchUserAddress = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5010/api/controller/get_user_address", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch address");
      const data: Address | null = await response.json();
      if (data) {
        setAddress(data);
        setStreet(data.street);
        setCity(data.city);
      } else {
        setAddress(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch address");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    setLoading(true);
    try {
      const apiUrl = address?.id
        ? `http://localhost:5010/api/controller/${address.id}`
        : "http://localhost:5010/api/controller/AddUserAddress";
      const method = address?.id ? "PUT" : "POST";

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ street, city }),
      });

      if (!response.ok) throw new Error("Failed to save address");
      fetchUserAddress(); // Refresh address after save
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Manage Address">
      {loading ? (
        <Text>Loading...</Text>
      ) : address ? (
        <>
          <TextInput label="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
          <TextInput label="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Button mt="md" onClick={handleSaveAddress} loading={loading}>
            Update Address
          </Button>
        </>
      ) : (
        <>
          <Text>No address found</Text>
          <TextInput label="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
          <TextInput label="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Button mt="md" onClick={handleSaveAddress} loading={loading}>
            Add Address
          </Button>
        </>
      )}
      {error && <Text color="red">{error}</Text>}
    </Modal>
  );
}

export default AddressModal;
