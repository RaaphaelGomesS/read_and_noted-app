import { NoteCategory } from '@/@types/auth.types';
import { Colors } from '@/constants/Colors';
import * as NoteService from '@/service/NoteService';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CategoryEditModal from '../categoryEditModal';
import Input from '../input';

type CategorySelectModalProps = {
  visible: boolean;
  currentCategoryName: string;
  onClose: () => void;
  onSelect: (categoryName: string) => void;
};

const CategorySelectModal = ({ visible, currentCategoryName, onClose, onSelect }: CategorySelectModalProps) => {
  const [categories, setCategories] = useState<NoteCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<NoteCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | null>(null);

  useEffect(() => {
    if (visible) {
      fetchCategories();
      setSearchText('');
    }
  }, [visible]);

  useEffect(() => {
    const lowerSearch = searchText.toLowerCase();
    setFilteredCategories(categories.filter(cat => cat.name.toLowerCase().includes(lowerSearch)));
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

  const handleCreate = async () => {
    const name = searchText.trim();
    if (!name) return;
    
    onSelect(name);
    onClose();
  };
  
  const openEditModal = (category: NoteCategory) => {
      setSelectedCategory(category);
      setEditModalVisible(true);
  };
  
  const onCategoryUpdated = (updatedCategory: NoteCategory) => {
      fetchCategories();
  };

  const onCategoryDeleted = (deletedId: number) => {
      fetchCategories();
      if (currentCategoryName === selectedCategory?.name) {
          onSelect('');
      }
  };

  const getCategoryColor = (categoryName: string) => {
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) { hash = categoryName.charCodeAt(i) + ((hash << 5) - hash); }
    return `hsl(${hash % 360}, 70%, 50%)`;
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
          <Text style={styles.modalTitle}>Tags</Text>
          <Input
            placeholder="Selecione uma opção ou crie uma"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
          />
          
          <View style={styles.selectedContainer}>
              <View style={[styles.tag, { backgroundColor: getCategoryColor(currentCategoryName) }]}>
                  <Text style={styles.tagText}>{currentCategoryName}</Text>
                  <TouchableOpacity onPress={() => onSelect('')}>
                      <Ionicons name="close" size={16} color={Colors.white} style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
              </View>
          </View>
          
          <Text style={styles.listHeader}>Selecione uma opção ou crie uma</Text>

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
                <TouchableOpacity onPress={handleCreate} style={styles.createButton}>
                   <Text style={styles.createText}>Criar tag "{searchText}"</Text>
                </TouchableOpacity>
              }
              style={styles.list}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '60%',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
     backgroundColor: Colors.surface,
  },
  selectedContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
  },
  listHeader: {
      color: Colors.textSecondary,
      fontSize: 12,
      marginTop: 16,
      marginBottom: 8,
      textTransform: 'uppercase',
  },
  list: {
    maxHeight: 200,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  tagText: {
    color: Colors.white,
    fontSize: 14,
  },
  optionsButton: {
      padding: 8,
  },
  createButton: {
      padding: 10,
  },
  createText: {
      color: Colors.accent,
      fontSize: 16,
  }
});

export default CategorySelectModal;