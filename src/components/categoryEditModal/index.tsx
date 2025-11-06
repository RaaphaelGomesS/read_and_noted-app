import { NoteCategory } from "@/@types/auth.types";
import { Colors } from "@/constants/Colors";
import * as NoteService from "@/service/NoteService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "../input";

type CategoryEditModalProps = {
  visible: boolean;
  category: NoteCategory | null;
  onClose: () => void;
  onSave: (updatedCategory: NoteCategory) => void;
  onDelete: (deletedCategoryId: number) => void;
};

const CategoryEditModal = ({ visible, category, onClose, onSave, onDelete }: CategoryEditModalProps) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSave = async () => {
    if (!category || !name.trim()) return;
    setIsLoading(true);
    try {
      const updated = await NoteService.updateNoteCategory(category.id, name.trim());
      onSave(updated);
      onClose();
    } catch (error: any) {
      Alert.alert("Erro ao Atualizar", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!category) return;
    Alert.alert("Confirmar Exclusão", `Tem certeza que deseja excluir a categoria "${category.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          try {
            await NoteService.deleteNoteCategory(category.id);
            onDelete(category.id);
            onClose();
          } catch (error: any) {
            Alert.alert("Erro ao Excluir", error.message);
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Input value={name} onChangeText={setName} style={styles.input} autoFocus />
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={16} color={"#FF453A"} />
            <Text style={styles.deleteText}>Excluir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneButton} onPress={handleSave}>
            <Text style={styles.doneText}>Concluído</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={[styles.doneText, styles.backText]}>Voltar</Text>
          </TouchableOpacity>

          {isLoading && <ActivityIndicator size="small" color={Colors.accent} />}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-start",
    paddingTop: 100,
  },
  modalContainer: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 16,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.boder,
    color: Colors.text,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 10,
    fontSize: 16,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  deleteText: {
    color: "#FF453A",
    fontSize: 15,
    marginLeft: 8,
  },
  doneButton: {
    position: "absolute",
    top: -40,
    right: 10,
    padding: 8,
  },
  doneText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    position: "absolute",
    top: -40,
    left: 10,
    padding: 8,
  },
  backText: {
    color: Colors.textSecondary,
  },
});

export default CategoryEditModal;
