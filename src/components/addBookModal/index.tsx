import { Colors } from "@/constants/Colors";
import React from "react";
import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { StyledButton } from "../button";

type AddBookModalProps = {
  visible: boolean;
  onClose: () => void;
  onNavigateToSearch: () => void;
  onNavigateToForm: () => void;
};

const AddBookModal = ({ visible, onClose, onNavigateToSearch, onNavigateToForm }: AddBookModalProps) => {
  const handleSearch = () => {
    onNavigateToSearch();
    onClose();
  };

  const handleForm = () => {
    onNavigateToForm();
    onClose();
  };

  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Adicionar livro</Text>
              <Text style={styles.modalSubtitle}>Como você deseja adicionar?</Text>

              <StyledButton title="Buscar template" onPress={handleSearch} style={styles.button} />
              <StyledButton
                title="Preencher formulário"
                variant="secondary"
                onPress={handleForm}
                style={styles.button}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: Colors.card,
    borderRadius: 15,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    width: "100%",
    marginVertical: 5,
  },
});

export default AddBookModal;
