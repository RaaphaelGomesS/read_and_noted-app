import { NoteCategory, NoteFilter as NoteFilterType, NoteSummary } from "@/@types/note.types";
import FilterModal, { SelectedFilters } from "@/components/filterModal";
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [notes, setNotes] = useState<NoteSummary[]>([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<NoteCategory[]>([]);
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);
  const [filter, setFilter] = useState<NoteFilterType>({
    page: 0,
    pageSize: 20,
    title: "",
    type: undefined,
    categoryId: undefined,
  });

  const fetchCategories = async () => {
    try {
      const cats = await NoteService.getNoteCategories();
      setAvailableCategories(cats);
    } catch (error: any) {
      console.warn("Não foi possível carregar categorias para filtro:", error.message);
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

  const handleApplyFilter = (newFilters: SelectedFilters) => {
    setFilter((prev) => ({
      ...prev,
      page: 0,
      type: newFilters.type,
      categoryId: newFilters.categoryId,
    }));

    if (newFilters.categoryId) {
      setActiveCategoryName(availableCategories.find((c) => c.id === newFilters.categoryId)?.name || null);
    } else {
      setActiveCategoryName(null);
    }
  };

  const handleOpenFilters = () => {
    setFilterModalVisible(true);
  };

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

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

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
          {filter.type && <View style={styles.filterActiveDot} />}
        </TouchableOpacity>
      </View>

      <View style={styles.activeFiltersContainer}>
        {filter.type && <Text style={styles.activeFilterText}>Tipo: {filter.type}</Text>}
        {activeCategoryName && <Text style={styles.activeFilterText}>Categoria: {activeCategoryName}</Text>}
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

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilter}
        currentFilters={{ type: filter.type, categoryId: filter.categoryId }}
        availableCategories={availableCategories}
      />
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
    position: "relative",
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  filterActiveDot: {
    position: "absolute",
    top: 10,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  activeFiltersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 4,
  },
  activeFilterText: {
    color: Colors.textSecondary,
    fontSize: 12,
    backgroundColor: Colors.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
});
