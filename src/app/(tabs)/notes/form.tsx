import { NoteRequest, NoteType } from '@/@types/auth.types';
import { StyledButton } from '@/components/button';
import CategoryPicker from '@/components/categoryPicker';
import Input from '@/components/input';
import { Colors } from '@/constants/Colors';
import * as NoteService from '@/service/NoteService';
import { Picker } from '@react-native-picker/picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

const NOTE_TYPES: NoteType[] = ['QUICK', 'REFERENCE', 'PERMANENT'];

export default function NoteFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ noteId?: string, title?: string }>();
  const noteId = params.noteId ? parseInt(params.noteId, 10) : null;
  const isEditing = noteId !== null;

  const [title, setTitle] = useState(params.title || '');
  const [content, setContent] = useState('');
  const [categoryName, setCategoryName] = useState<string | undefined>(); 
  const [noteType, setNoteType] = useState<NoteType>('QUICK');
  const [bookReferenceId, setBookReferenceId] = useState<number | undefined>();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(isEditing);

  const loadNoteData = async () => {
    if (isEditing && noteId) {
      setIsFetchingData(true);
      try {
        const note = await NoteService.getNoteById(noteId);
        setTitle(note.title);
        setContent(note.content);
        setCategoryName(note.category);
        setNoteType(note.type);
        setBookReferenceId(note.bookReference || undefined);
      } catch (error) {
        console.error("Erro ao carregar dados da nota:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados da anotação.");
      } finally {
        setIsFetchingData(false);
      }
    } else {
        setIsFetchingData(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !categoryName?.trim()) {
      Alert.alert("Erro", "Título e Categoria são obrigatórios.");
      return;
    }

    setIsLoading(true);
    try {
      const noteData: NoteRequest = {
        id: noteId ?? undefined,
        title,
        content,
        category: categoryName,
        type: noteType,
        reference: bookReferenceId,
      };

      if (isEditing) {
        await NoteService.updateNote(noteData);
      } else {
        await NoteService.createNote(noteData);
      }
      router.back();
    } catch (error: any) {
      console.error("Erro ao salvar anotação:", error);
      Alert.alert("Erro", error.message || "Não foi possível salvar a anotação.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
       <Stack.Screen options={{ title: isEditing ? 'Editar Anotação' : 'Nova Anotação' }} />

      <View style={styles.form}>
        <Input
          placeholder="Título da Anotação"
          value={title}
          onChangeText={setTitle}
        />

        <Input
          placeholder="Escreva sua anotação aqui... Use [[links]] para conectar ideias."
          value={content}
          onChangeText={setContent}
          multiline
          style={styles.contentInput}
          textAlignVertical="top"
        />

        <CategoryPicker
            selectedValue={categoryName}
            onValueChange={setCategoryName}
        />

        <Text style={styles.label}>Tipo de Anotação</Text>
         <View style={styles.pickerContainer}>
            <Picker
                selectedValue={noteType}
                onValueChange={(itemValue) => setNoteType(itemValue)}
                style={styles.picker}
                dropdownIconColor={Colors.text}
                 itemStyle={styles.pickerItem}
            >
                {NOTE_TYPES.map(type => (
                <Picker.Item key={type} label={type} value={type} color={Colors.text} />
                ))}
            </Picker>
        </View>

        <StyledButton
          title={isLoading ? "Salvando..." : "Salvar Anotação"}
          onPress={handleSave}
          disabled={isLoading}
          style={{ marginTop: 20 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  form: {
      padding: 16,
  },
  contentInput: {
    minHeight: 250,
    backgroundColor: Colors.background,
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 4,
    paddingTop: 18,
    borderWidth: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.surface,
    marginBottom: 16,
  },
  label: {
      color: Colors.textSecondary,
      fontSize: 16,
      marginLeft: 4,
      marginTop: 10,
      marginBottom: 8,
  },
  pickerContainer: {
      backgroundColor: Colors.card,
      borderRadius: 10,
      marginBottom: 16,
  },
  picker: {
      color: Colors.text,
      height: 50,
  },
   pickerItem: {
       color: Colors.text,
   },
});