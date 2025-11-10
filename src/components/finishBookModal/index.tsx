import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StyledButton } from "../button";

type FinishBookModalProps = {
  visible: boolean;
  bookTitle: string;
  onClose: () => void;
  onSubmit: (rating: number) => void;
};

const Star = ({ index, rating, setRating }: { index: number; rating: number; setRating: (rating: number) => void }) => {
  let iconName: "star" | "star-half" | "star-outline" = "star-outline";
  if (rating >= index) {
    iconName = "star";
  } else if (rating >= index - 0.5) {
    iconName = "star-half";
  }

  return (
    <View style={styles.starWrapper}>
      <Ionicons name={iconName} size={40} color={Colors.accent} />
      <TouchableOpacity style={styles.halfStarLeft} onPress={() => setRating(index - 0.5)} />
      <TouchableOpacity style={styles.halfStarRight} onPress={() => setRating(index)} />
    </View>
  );
};

const FinishBookModal = ({ visible, bookTitle, onClose, onSubmit }: FinishBookModalProps) => {
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    onSubmit(rating);
    setRating(0);
  };

  const handleClose = () => {
    onClose();
    setRating(0);
  };

  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Deseja concluir a leitura?</Text>
          <Text style={styles.modalBookTitle}>{bookTitle}</Text>
          <Text style={styles.ratingLabel}>Qual sua avaliação?</Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((index) => (
              <Star key={index} index={index} rating={rating} setRating={setRating} />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <StyledButton
              title="Cancelar"
              variant="secondary"
              onPress={handleClose}
              style={[styles.button, styles.cancelButton]}
            />
            <StyledButton title="Salvar" onPress={handleSubmit} style={styles.button} disabled={rating === 0} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: Colors.background,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 10,
  },
  modalBookTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },
  ratingLabel: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },
  starWrapper: {
    position: "relative",
    width: 40,
    height: 40,
  },
  halfStarLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "50%",
  },
  halfStarRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "50%",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: Colors.accent,
  },
  cancelButton: {
    backgroundColor: Colors.surface,
  },
});

export default FinishBookModal;
