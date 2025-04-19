import { useState, useEffect } from "react";
import { Modal, Button, Textarea, Group, Text, Divider, ScrollArea } from "@mantine/core";
import axios from "axios";
import Cookies from "js-cookie";

interface Review {
  id: string;
  userId: number;
  comment: string;
}

interface ReviewModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ productId, isOpen, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState<string>("");
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5010/api/reviews/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    if (isOpen && productId) {
      fetchReviews();
    }
  }, [isOpen, productId, token]);

  const handleAddReview = async () => {
    if (!comment) return;

    try {
      const userId = Cookies.get("userId");
      await axios.post(
        "http://localhost:5010/api/reviews",
        {
          productId: Number(productId),
          userId,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComment("");
      onClose();
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Reviews" size="lg">
      {/* Fixed ScrollArea with proper style prop */}
      <ScrollArea style={{ height: 300 }}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id}>
              <Text>{review.comment}</Text>
              <Divider my="sm" />
            </div>
          ))
        ) : (
          <Text>No reviews yet.</Text>
        )}
      </ScrollArea>
      <Textarea
        placeholder="Add your review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        mt="sm"
      />
      <Group justify="right" mt="sm">
        <Button onClick={handleAddReview} color="blue">
          Add Review
        </Button>
      </Group>
    </Modal>
  );
};

export default ReviewModal;