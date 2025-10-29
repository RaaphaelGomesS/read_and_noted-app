import { NoteFull } from '@/@types/auth.types';
import MarkdownRenderer from '@/components/markdownContent';
import OptionsModal from '@/components/optionsModal';
import { Colors } from '@/constants/Colors';
import * as NoteService from '@/service/NoteService';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NoteDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const noteId = parseInt(params.id, 10);

  const [note, setNote] = useState<NoteFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchNote = async () => {
    if (!noteId) return;
    setIsLoading(true);
    try {
      const data = await NoteService.getNoteById(noteId);
      setNote(data);
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

  const handleEdit = () => {
    router.push({ pathname: '/notes/form', params: { noteId: noteId } });
  };

  const handleDelete = () => {
     Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a anotação "${note?.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await NoteService.deleteNote(noteId);
              router.back(); 
            } catch (error) {
              console.error("Erro ao excluir anotação:", error);
              Alert.alert("Erro", "Não foi possível excluir a anotação.");
            }
          },
        },
      ]
    );
  };

  const modalOptions = [
    { label: 'Editar', onPress: handleEdit },
    { label: 'Excluir', onPress: handleDelete, isDestructive: true },
  ];

  const getCategoryColor = (categoryName: string) => {
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) { hash = categoryName.charCodeAt(i) + ((hash << 5) - hash); }
    return `hsl(${hash % 360}, 70%, 60%)`;
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
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ padding: 8 }}>
              <Ionicons name="ellipsis-horizontal" size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{note.title}</Text>
        
        <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} style={styles.metaIcon} />
                <Text style={styles.metaLabel}>Data</Text>
                <Text style={styles.metaValue}>{note.createdDate.split(' ')[0]}</Text>
            </View>
             <View style={styles.metaItem}>
                <Ionicons name="pricetag-outline" size={16} color={Colors.textSecondary} style={styles.metaIcon} />
                <Text style={styles.metaLabel}>Categoria</Text>
                <View style={[styles.tag, { backgroundColor: getCategoryColor(note.category) }]}>
                    <Text style={styles.tagText}>{note.category}</Text>
                </View>
            </View>

             {note.bookReference && (
                <View style={styles.metaItem}>
                    <Ionicons name="book-outline" size={16} color={Colors.textSecondary} style={styles.metaIcon} />
                    <Text style={styles.metaLabel}>Referência</Text>
                     <View style={[styles.tag, { backgroundColor: Colors.surface }]}>
                        <Text style={styles.tagText}>Nome do Livro (ID: {note.bookReference})</Text>
                    </View>
                </View>
             )}
             <View style={styles.metaItem}>
                <Ionicons name="bookmark-outline" size={16} color={Colors.textSecondary} style={styles.metaIcon} />
                <Text style={styles.metaLabel}>Tipo de nota</Text>
                <View style={[styles.tag, { backgroundColor: getTypeColor(note.type) }]}>
                    <Text style={styles.tagText}>{note.type}</Text>
                </View>
            </View>
        </View>

        <View style={styles.contentContainer}>
            <MarkdownRenderer content={note.content} linkedNotes={note.linkedNotes} />
        </View>
      </ScrollView>

      <OptionsModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        options={modalOptions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
      padding: 20,
      paddingTop: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  metaContainer: {
      marginBottom: 24,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.card,
      paddingTop: 16,
  },
  metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
  },
  metaIcon: {
      marginRight: 8,
  },
  metaLabel: {
      color: Colors.textSecondary,
      fontSize: 15,
      width: 90,
  },
  metaValue: {
      color: Colors.text,
      fontSize: 15,
  },
  tag: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tagText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '500',
  },
  contentContainer: {
      marginTop: 8,
  },
});