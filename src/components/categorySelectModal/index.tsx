import { NoteCategory } from "@/@types/note.types";
import { Colors } from "@/constants/Colors";
import * as NoteService from "@/service/NoteService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StyledButton } from "../button";
import CategoryEditModal from "../categoryEditModal";
import Input from "../input";

type CategorySelectModalProps = {
  visible: boolean;
  currentCategoryName: string | null;
  onClose: () => void;
  onSelect: (categoryName: string) => void;
};

const CategorySelectModal = ({ visible, currentCategoryName, onClose, onSelect }: CategorySelectModalProps) => {
  const [categories, setCategories] = useState<NoteCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<NoteCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | null>(null);

  useEffect(() => {
    if (visible) {
      fetchCategories();
      setSearchText("");
    }
  }, [visible]);

  useEffect(() => {
    const lowerSearch = searchText.toLowerCase().trim();
    if (lowerSearch === "") {
      setFilteredCategories(categories);
      setIsCreating(false);
    } else {
      const filtered = categories.filter((cat) => cat.name.toLowerCase().includes(lowerSearch));
      setFilteredCategories(filtered);

      const exactMatch = categories.some((cat) => cat.name.toLowerCase() === lowerSearch);
      setIsCreating(!exactMatch);
    }
  }, [searchText, categories]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const cats = await NoteService.getNoteCategories();
      setCategories(cats);
      setFilteredCategories(cats);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível carregar categorias.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (category: NoteCategory) => {
    onSelect(category.name);
    onClose();
  };

  const handleSaveNew = async () => {
    const name = searchText.trim();
    if (!name || !isCreating) return;

    Keyboard.dismiss();

    onSelect(name);
    onClose();
  };

  const openEditModal = (category: NoteCategory) => {
    setSelectedCategory(category);
    setEditModalVisible(true);
  };

  const onCategoryUpdated = (updatedCategory: NoteCategory) => {
    fetchCategories();
    if (currentCategoryName === selectedCategory?.name) {
      onSelect(updatedCategory.name);
    }
  };

  const onCategoryDeleted = (deletedId: number) => {
    fetchCategories();
    if (currentCategoryName === selectedCategory?.name) {
      onSelect("");
    }
  };

  const getCategoryColor = (categoryName: string | null) => {
    if (!categoryName) return Colors.surface;

    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 50%)`;
  };

  return (
    <Modal transparent={true} animationType="slide" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
          <Text style={styles.modalTitle}>Categorias</Text>
          <Input
            placeholder="Digite para encontrar ou criar uma categoria"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
          />

          {isCreating && searchText.length > 0 && (
            <StyledButton title={`Salvar "${searchText}"`} onPress={handleSaveNew} style={styles.saveButton} />
          )}

          {currentCategoryName && (
            <View style={styles.selectedContainer}>
              <Text style={styles.listHeader}>Selecionada</Text>
              <View style={[styles.tag, { backgroundColor: getCategoryColor(currentCategoryName) }]}>
                <Text style={styles.tagText}>{currentCategoryName}</Text>

                <TouchableOpacity
                  onPress={() => {
                    onSelect("");
                    onClose();
                  }}
                >
                  <Ionicons name="close" size={16} color={Colors.white} style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text style={styles.listHeader}>Selecione uma opção</Text>

          {isLoading ? (
            <ActivityIndicator color={Colors.accent} style={{ height: 150 }} />
          ) : (
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.categoryItem}>
                  <TouchableOpacity style={styles.categoryButton} onPress={() => handleSelect(item)}>
                    <View style={[styles.tag, { backgroundColor: getCategoryColor(item.name) }]}>
                      <Text style={styles.tagText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.optionsButton} onPress={() => openEditModal(item)}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                !isCreating && searchText ? <Text style={styles.emptyText}>Nenhuma categoria encontrada.</Text> : null
              }
              style={styles.list}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>

      <CategoryEditModal
        visible={editModalVisible}
        category={selectedCategory}
        onClose={() => setEditModalVisible(false)}
        onSave={onCategoryUpdated}
        onDelete={onCategoryDeleted}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: Colors.accent,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedContainer: {
    marginTop: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.surface,
    paddingBottom: 10,
  },
  listHeader: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 16,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  list: {
    maxHeight: 250,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  categoryButton: {
    flex: 1,
  },
  tag: {
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.accent,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  tagText: {
    color: Colors.white,
    fontSize: 14,
  },
  optionsButton: {
    padding: 8,
  },
  emptyText: {
    color: Colors.textSecondary,
    padding: 10,
    textAlign: "center",
  },
});

export default CategorySelectModal;
