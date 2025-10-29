import { NoteFull, NoteRequest } from '@/@types/auth.types';
import CategorySelectModal from '@/components/categorySelectModal';
import MarkdownRenderer from '@/components/markdownContent';
import OptionsModal from '@/components/optionsModal';
import { Colors } from '@/constants/Colors';
import * as NoteService from '@/service/NoteService';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const NOTE_TYPES: NoteRequest['type'][] = ['QUICK', 'REFERENCE', 'PERMANENT'];

export default function NoteDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const noteId = parseInt(params.id, 10);

  const [note, setNote] = useState<NoteFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // --- Estados de Edição ---
  const [isEditingText, setIsEditingText] = useState(false);
  const [editedContent, setEditedContent] = useState(''); 
  
  // --- Estados dos Modais ---
  const [isOptionsModalVisible, setOptionsModalVisible] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isTypeModalVisible, setTypeModalVisible] = useState(false);


  const fetchNote = async () => {
    if (!noteId) return;
    setIsLoading(true);
    try {
      const data = await NoteService.getNoteById(noteId);
      setNote(data);
      setEditedContent(data.content);
    } catch (error) {
      console.error("Erro ao buscar anotação:", error);
      Alert.alert("Erro", "Não foi possível carregar a anotação.", [
          { text: "OK", onPress: () => router.back() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNote();
    }, [noteId])
  );

  // --- Funções de Salvamento ---
  
  // Salva qualquer propriedade da nota
  const saveNoteProperty = async (data: Partial<NoteRequest>) => {
      if (!note) return;
      setIsSaving(true);
      try {
          const updatedData: NoteRequest = {
              id: note.id,
              title: data.title || note.title,
              content: data.content || note.content,
              category: data.category || note.category,
              type: data.type || note.type,
              reference: data.reference || note.bookReference || undefined,
          };
          await NoteService.updateNote(updatedData);
          // Recarrega a nota para garantir consistência
          fetchNote(); 
      } catch (error: any) {
          Alert.alert("Erro ao Salvar", error.message);
      } finally {
          setIsSaving(false);
      }
  };

  const handleToggleEditMode = () => {
    if (isEditingText) {
      // Se estava editando, salvar o conteúdo
      saveNoteProperty({ content: editedContent });
    } else {
        // Se começou a editar, sincroniza o conteúdo
        setEditedContent(note?.content || '');
    }
    setIsEditingText(!isEditingText);
  };

  const handleDelete = () => {
     Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a anotação "${note?.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: async () => {
            try {
              await NoteService.deleteNote(noteId);
              router.back();
            } catch (error: any) {
              Alert.alert("Erro ao Excluir", error.message);
            }
          },
        },
      ]
    );
  };
  
  const topMenuOptions = [
    { label: isEditingText ? 'Salvar Corpo' : 'Editar Corpo', onPress: handleToggleEditMode },
    { label: 'Excluir Anotação', onPress: handleDelete, isDestructive: true },
  ];
  
  // --- Funções de Renderização de Meta-dados ---
  const getCategoryColor = (categoryName: string) => {
      if (!categoryName) return Colors.surface;
      let hash = 0;
      for (let i = 0; i < categoryName.length; i++) { hash = categoryName.charCodeAt(i) + ((hash << 5) - hash); }
      return `hsl(${hash % 360}, 70%, 50%)`;
  };
  const getTypeColor = (type: NoteFull['type']) => { 
      switch (type) {
        case 'PERMANENT': return '#E53935';
        case 'REFERENCE': return '#1E88E5';
        case 'QUICK': return '#43A047';
        default: return Colors.textSecondary;
      }
  };


  if (isLoading || !note) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {isSaving && <ActivityIndicator size="small" color={Colors.accent} style={{ marginRight: 15 }} />}
                <TouchableOpacity onPress={() => setOptionsModalVisible(true)} style={{ padding: 8 }}>
                  <Ionicons name="ellipsis-horizontal" size={24} color={Colors.text} />
                </TouchableOpacity>
             </View>
          ),
          headerTitle: "", 
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <TextInput
            style={styles.titleInput}
            value={note.title}
            onChangeText={(text) => setNote(prev => prev ? {...prev, title: text} : null)}
            onEndEditing={(e) => saveNoteProperty({ title: e.nativeEvent.text })}
            placeholder="Título..."
            placeholderTextColor={Colors.textSecondary}
        />
        
        <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} style={styles.metaIcon} />
                <Text style={styles.metaLabel}>Data</Text>
                <Text style={styles.metaValue}>{note.createdDate.split(' ')[0]}</Text>
            </View>

             <TouchableOpacity style={styles.metaItem} onPress={() => setCategoryModalVisible(true)}>
                <Ionicons name="pricetag-outline" size={16} color={Colors.textSecondary} style={styles.metaIcon} />
                <Text style={styles.metaLabel}>Categoria</Text>
                <View style={[styles.tag, { backgroundColor: getCategoryColor(note.category) }]}>
                    <Text style={styles.tagText}>{note.category || "Sem Categoria"}</Text>
                </View>
            </TouchableOpacity>
             
             {/* TODO: Adicionar Lógica para Referência de Livro */}
             
             <TouchableOpacity style={styles.metaItem} onPress={() => setTypeModalVisible(true)}>
                <Ionicons name="bookmark-outline" size={16} color={Colors.textSecondary} style={styles.metaIcon} />
                <Text style={styles.metaLabel}>Tipo de nota</Text>
                <View style={[styles.tag, { backgroundColor: getTypeColor(note.type) }]}>
                    <Text style={styles.tagText}>{note.type}</Text>
                </View>
            </TouchableOpacity>
        </View>
        
        <View style={styles.divider} />

        {/* Corpo do Texto (Alterna entre View e Edit) */}
        <View style={styles.contentContainer}>
          {isEditingText ? (
              <TextInput
                  style={[styles.text, styles.textInput]}
                  value={editedContent}
                  onChangeText={setEditedContent}
                  multiline
                  autoFocus
                  placeholder="Comece a escrever..."
                  placeholderTextColor={Colors.textSecondary}
              />
          ) : (
            <MarkdownRenderer content={note.content} linkedNotes={note.linkedNotes} />
          )}
        </View>
      </ScrollView>

      {/* --- Modais --- */}
      <OptionsModal
        visible={isOptionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        options={topMenuOptions}
      />
      
      <CategorySelectModal
          visible={isCategoryModalVisible}
          onClose={() => setCategoryModalVisible(false)}
          currentCategoryName={note.category}
          onSelect={(newCategoryName) => {
              saveNoteProperty({ category: newCategoryName });
          }}
      />
      
      {/* Modal para o Picker de Tipo de Nota */}
      <Modal
          transparent={true}
          animationType="fade"
          visible={isTypeModalVisible}
          onRequestClose={() => setTypeModalVisible(false)}>
           <TouchableOpacity style={styles.pickerOverlay} onPress={() => setTypeModalVisible(false)}>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={note.type}
                        onValueChange={(itemValue: NoteFull['type']) => {
                            saveNoteProperty({ type: itemValue });
                            setTypeModalVisible(false);
                        }}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                       >
                        {NOTE_TYPES.map(type => (
                            <Picker.Item key={type} label={type} value={type} color={Colors.text} />
                        ))}
                    </Picker>
                </View>
           </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  scrollContainer: { paddingBottom: 50 },
  titleInput: {
      fontSize: 28,
      fontWeight: 'bold',
      color: Colors.text,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 16,
  },
  metaContainer: {
      paddingHorizontal: 20,
  },
  metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
  },
  metaIcon: { marginRight: 12, width: 20 },
  metaLabel: { color: Colors.textSecondary, fontSize: 15, width: 90 },
  metaValue: { color: Colors.text, fontSize: 15 },
  tag: { borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 },
  tagText: { color: Colors.white, fontSize: 13, fontWeight: '500' },
  divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.card,
      marginHorizontal: 20,
      marginVertical: 12,
  },
  contentContainer: {
      paddingHorizontal: 20,
      paddingBottom: 50,
  },
  text: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 26,
  },
  textInput: {
    minHeight: 300,
    textAlignVertical: 'top',
  },

   pickerOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'flex-end',
  },
  pickerContainer: {
      backgroundColor: Colors.card,
      ...(Platform.OS === 'android' && {
         borderRadius: 14,
         margin: 10,
      })
  },
  picker: {
      color: Colors.text,
       ...(Platform.OS === 'ios' && {
         height: 200,
      })
  },
   pickerItem: {
       color: Colors.text,
   },
});