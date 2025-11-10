import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type EditPagesModalProps = {
  visible: boolean;
  bookTitle: string;
  currentPages: number;
  totalPages: number;
  onClose: () => void;
  onSubmit: (pages: number) => void;
};

const EditPagesModal = ({ visible, bookTitle, currentPages, totalPages, onClose, onSubmit }: EditPagesModalProps) => {
  const [pages, setPages] = useState(String(currentPages));

  useEffect(() => {
    setPages(String(currentPages));
  }, [currentPages]);

  const handleSubmit = () => {
    const numPages = parseInt(pages, 10);
    if (!isNaN(numPages) && numPages <= totalPages && numPages >= 0) {
      onSubmit(numPages);
    } else {
      console.warn("Número de páginas inválido");
    }
  };

  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Atualizar progresso</Text>
          <Text style={styles.modalBookTitle}>{bookTitle}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={pages}
              onChangeText={setPages}
              keyboardType="number-pad"
              maxLength={String(totalPages).length}
            />
            <Text style={styles.totalPagesText}>/ {totalPages} páginas</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    color: "#FFF",
    marginBottom: 10,
  },
  modalBookTitle: {
    fontSize: 16,
    color: "#CCC",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  input: {
    backgroundColor: Colors.card,
    color: "#FFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    minWidth: 80,
    textAlign: "center",
  },
  totalPagesText: {
    color: "#CCC",
    fontSize: 16,
    marginLeft: 10,
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
  },
  cancelButton: {
    backgroundColor: Colors.surface,
  },
  saveButton: {
    backgroundColor: Colors.accent,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditPagesModal;
