import { BookTemplate, BookTemplateSearchFilter } from "@/@types/auth.types";
import TemplateSearchCard from "@/components/templateSearchCard";
import { Colors } from "@/constants/Colors";
import * as BookTemplateService from "@/service/BookTemplateService";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type FilterType = "title" | "author" | "ISBN";

export default function BookSearchScreen() {
  const router = useRouter();
  const { libraryId } = useLocalSearchParams<{ libraryId: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BookTemplate[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("title");

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setIsLoading(true);
    setResults([]);

    const filter: BookTemplateSearchFilter = {
      [filterType]: searchText.trim(),
      page: 0,
      pageSize: 20,
    };

    try {
      const response = await BookTemplateService.searchTemplates(filter);
      setResults(response.data);
    } catch (error: any) {
      Alert.alert("Erro na Busca", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template: BookTemplate) => {
    router.replace({
      pathname: "/books/form",
      params: {
        libraryId: libraryId,
        template: JSON.stringify(template),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Buscar Template" }} />

      <View style={styles.searchBarContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Dostoievski..."
            placeholderTextColor={Colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        {/* Botão de Filtro (abre um modal) */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            /* TODO: Abrir Modal de Filtro */
          }}
        >
          <Ionicons name="filter" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Seletor de Tipo de Filtro */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={filterType}
          onValueChange={(itemValue) => setFilterType(itemValue)}
          style={styles.picker}
          dropdownIconColor={Colors.text}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Buscar por Título" value="title" color={Colors.text} />
          <Picker.Item label="Buscar por Autor" value="author" color={Colors.text} />
          <Picker.Item label="Buscar por ISBN" value="ISBN" color={Colors.text} />
        </Picker>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.accent} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TemplateSearchCard template={item} onSelect={() => handleSelectTemplate(item)} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum template encontrado.</Text>}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchBarContainer: {
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
  searchIcon: { marginRight: 8 },
  input: { flex: 1, color: Colors.text, paddingVertical: 12, fontSize: 16 },
  filterButton: { padding: 10, marginLeft: 8 },
  pickerContainer: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  picker: {
    color: Colors.text,
    height: 50,
  },
  pickerItem: { color: Colors.text },
  emptyText: { color: Colors.textSecondary, textAlign: "center", marginTop: 50, fontSize: 16 },
});
