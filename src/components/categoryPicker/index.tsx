import { NoteCategory } from '@/@types/auth.types';
import { Colors } from '@/constants/Colors';
import * as NoteService from '@/service/NoteService';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CreateCategoryModal from '../createCategory';

type CategoryPickerProps = {
  selectedValue: string | undefined;
  onValueChange: (name: string) => void;
};

const CategoryPicker = ({ selectedValue, onValueChange }: CategoryPickerProps) => {
  const [categories, setCategories] = useState<NoteCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const cats = await NoteService.getNoteCategories();
      setCategories(cats);
      if (!selectedValue && cats.length > 0) {
        onValueChange(cats[0].name);
      } else if (selectedValue && !cats.some(c => c.name === selectedValue)) {
         onValueChange(cats.length > 0 ? cats[0].name : '');
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (categoryToDelete: NoteCategory) => {
    if (categoryToDelete.name === selectedValue) {
        Alert.alert("Atenção", "Mude a categoria selecionada antes de excluir.");
        return;
    }

    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a categoria "${categoryToDelete.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await NoteService.deleteNoteCategory(categoryToDelete.id);
              fetchCategories();
            } catch (error: any) {
              console.error("Erro ao excluir categoria:", error);
              Alert.alert("Erro", error.message || "Não foi possível excluir a categoria.");
            }
          },
        },
      ]
    );
  };

  const handleCategoryCreated = (newCategory: NoteCategory) => {
      fetchCategories();
      onValueChange(newCategory.name);
  };


  if (isLoading) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.accent} />
             <Text style={styles.loadingText}>Carregando categorias...</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerRow}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => onValueChange(itemValue)}
            style={styles.picker}
            dropdownIconColor={Colors.text}
            itemStyle={styles.pickerItem}
          >
            {categories.length === 0 && <Picker.Item label="Nenhuma categoria..." value="" color={Colors.textSecondary}/>}
            {categories.map(cat => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.name} color={Colors.text} />
            ))}
          </Picker>
            {selectedValue && categories.find(c => c.name === selectedValue) && (
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => {
                  const categoryToDelete = categories.find(c => c.name === selectedValue);
                  if (categoryToDelete) {
                      handleDelete(categoryToDelete);
                  }
                }}
              >
                <Ionicons name="trash-outline" size={22} color={'#FF453A'} />
              </TouchableOpacity>
            )}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <CreateCategoryModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onCategoryCreated={handleCategoryCreated}
      />
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
    marginBottom: 16,
  },
   label: {
      color: Colors.textSecondary,
      fontSize: 16,
      marginLeft: 4,
      marginBottom: 8,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    color: Colors.text,
    height: 50,
  },
   pickerItem: {
       color: Colors.text,
   },
   deleteIcon: {
       paddingHorizontal: 15,
       height: '100%',
       justifyContent: 'center',
   },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      height: 50,
  },
  loadingText: {
      color: Colors.textSecondary,
      marginLeft: 10,
  }
});

export default CategoryPicker;