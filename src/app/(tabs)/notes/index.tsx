import { NoteFilter as NoteFilterType, NoteSummary } from "@/@types/note.types";
import FloatingActionButton from "@/components/floatingButton";
import NoteCard from "@/components/noteCard";
import { Colors } from "@/constants/Colors";
import * as NoteService from "@/service/NoteService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function NotesScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<NoteSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<NoteFilterType>({ page: 0, pageSize: 20 });
  const [searchText, setSearchText] = useState("");

  const fetchNotes = async (currentFilter: NoteFilterType) => {
    setIsLoading(true);
    try {
      const response = await NoteService.getNotes(currentFilter);

      setNotes(response.data);
    } catch (error) {
      console.error("Erro ao buscar anotações:", error);
      Alert.alert("Erro", "Não foi possível carregar suas anotações.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes(filter);
    }, [filter])
  );

  const handleSearch = () => {
    setFilter((prev) => ({ ...prev, title: searchText, page: 0 }));
  };

  const handleOpenFilters = () => {
    Alert.alert("Filtros", "O modal de filtros avançados será implementado aqui.");
  };

  const handleCardPress = (noteId: number) => {
    router.push(`/notes/${noteId}`);
  };

  const handleAddPress = async () => {
    setIsLoading(true);
    try {
      const newNote = await NoteService.createNote();

      router.push(`/notes/${newNote.id}`);
    } catch (error: any) {
      console.error("Erro ao criar anotação:", error);
      Alert.alert("Erro", error.message || "Não foi possível criar a anotação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Pesquisar por título"
            placeholderTextColor={Colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleOpenFilters}>
          <Ionicons name="filter" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.accent} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <NoteCard note={item} onPress={() => handleCardPress(item.id)} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma anotação encontrada.</Text>}
          contentContainerStyle={notes.length === 0 ? styles.center : { paddingBottom: 100 }}
          onRefresh={() => fetchNotes(filter)}
          refreshing={isLoading}
        />
      )}

      <FloatingActionButton onPress={handleAddPress} iconName="add" />
      {/* TODO: Adicionar <FilterModal /> aqui */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: Colors.text,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterButton: {
    padding: 10,
    marginLeft: 8,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
