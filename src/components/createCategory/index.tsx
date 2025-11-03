import { NoteCategory } from '@/@types/auth.types';
import { Colors } from '@/constants/Colors';
import * as NoteService from '@/service/NoteService';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StyledButton } from '../button';
import Input from '../input';

type CreateCategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onCategoryCreated: (newCategory: NoteCategory) => void; 
};

const CreateCategoryModal = ({
  visible,
  onClose,
  onCategoryCreated,
}: CreateCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      Alert.alert("Erro", "O nome da categoria não pode estar vazio.");
      return;
    }

    setIsLoading(true);
    try {
      const newCategory = await NoteService.createNoteCategory(trimmedName);
      onCategoryCreated(newCategory);
      setCategoryName('');
      onClose();
    } catch (error: any) {
      console.error("Erro ao criar categoria:", error);
      Alert.alert("Erro", error.message || "Não foi possível criar a categoria.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Nova categoria</Text>

          <Input
            placeholder="Nome da Categoria"
            value={categoryName}
            onChangeText={setCategoryName}
            style={{ marginBottom: 20 }}
            autoFocus
          />

          <View style={styles.buttonContainer}>
            <StyledButton
              title="Cancelar"
              variant="secondary"
              onPress={onClose}
              style={styles.button}
              disabled={isLoading}
            />
            <StyledButton
              title={isLoading ? "Salvando..." : "Salvar"}
              onPress={handleSave}
              style={styles.button}
              disabled={isLoading}
            />
          </View>
          {isLoading && <ActivityIndicator style={{ marginTop: 10 }} color={Colors.accent} />}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: Colors.card,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default CreateCategoryModal;