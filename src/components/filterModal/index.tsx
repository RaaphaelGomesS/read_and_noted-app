import { NoteCategory, NoteType } from "@/@types/note.types";
import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StyledButton } from "../button";

export type SelectedFilters = {
  type?: NoteType;
  categoryId?: number;
};

const NOTE_TYPE_OPTIONS: { label: string; value?: NoteType }[] = [
  { label: "Todos", value: undefined },
  { label: "Rápida", value: "Rápida" },
  { label: "Referência", value: "Referência" },
  { label: "Permanente", value: "Permanente" },
];

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: SelectedFilters) => void;
  currentFilters: SelectedFilters;
  availableCategories: NoteCategory[];
};

const FilterModal = ({ visible, onClose, onApply, currentFilters, availableCategories }: FilterModalProps) => {
  const [tempType, setTempType] = useState(currentFilters.type);
  const [tempCategoryId, setTempCategoryId] = useState(currentFilters.categoryId);

  const allCategoriesOption: NoteCategory = {
    id: -1,
    name: "Todas",
  };

  useEffect(() => {
    if (visible) {
      setTempType(currentFilters.type);
      setTempCategoryId(currentFilters.categoryId);
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApply({
      type: tempType,
      categoryId: tempCategoryId,
    });
    onClose();
  };

  const handleClear = () => {
    setTempType(undefined);
    setTempCategoryId(undefined);
    onApply({
      type: undefined,
      categoryId: undefined,
    });
    onClose();
  };

  const renderCategoryItem = ({ item }: { item: NoteCategory }) => {
    const isActive = (item.id === -1 && tempCategoryId === undefined) || tempCategoryId === item.id;

    return (
      <TouchableOpacity
        style={[styles.categoryRow, isActive && styles.categoryRowActive]}
        onPress={() => setTempCategoryId(item.id === -1 ? undefined : item.id)}
      >
        <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const categoryData = [allCategoriesOption, ...availableCategories];

  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
          <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.modalTitle}>Filtrar Anotações</Text>

            <Text style={styles.sectionTitle}>Tipo</Text>
            <View style={styles.tagContainer}>
              {NOTE_TYPE_OPTIONS.map((item) => {
                const isActive = tempType === item.value;
                return (
                  <TouchableOpacity
                    key={item.value || "all-types"}
                    style={[styles.tag, isActive ? styles.tagActive : styles.tagInactive]}
                    onPress={() => setTempType(item.value)}
                  >
                    <Text style={[styles.tagText, isActive && styles.tagTextActive]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>Categoria</Text>
          </ScrollView>

          <View style={styles.categoryListContainer}>
            <FlatList
              data={categoryData}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma categoria encontrada.</Text>}
              keyboardShouldPersistTaps="handled"
            />
          </View>

          <View style={styles.buttonContainer}>
            <StyledButton
              title="Limpar"
              variant="secondary"
              onPress={handleClear}
              style={[styles.flexButton, styles.flexCancelButton]}
            />
            <StyledButton title="Aplicar" onPress={handleApply} style={styles.flexButton} />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
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
    maxHeight: "90%",
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 0,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  tag: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  tagInactive: {
    backgroundColor: Colors.surface,
  },
  tagActive: {
    backgroundColor: Colors.accent,
  },
  tagText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  tagTextActive: {
    color: Colors.white,
    fontWeight: "bold",
  },
  categoryListContainer: {
    flexShrink: 1,
    minHeight: 100,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: Colors.card,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  categoryRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  categoryRowActive: {
    backgroundColor: "rgba(157, 90, 239, 0.2)",
  },
  categoryText: {
    color: Colors.text,
    fontSize: 16,
  },
  categoryTextActive: {
    color: Colors.accent,
    fontWeight: "bold",
  },
  emptyText: {
    color: Colors.textSecondary,
    padding: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "47.7%",
    gap: 20,
  },
  flexButton: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accent,
  },
  flexCancelButton: {
    backgroundColor: Colors.surface,
  },
});

export default FilterModal;
