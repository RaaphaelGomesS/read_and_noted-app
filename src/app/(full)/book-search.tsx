import { BookTemplate, BookTemplateSearchFilter } from "@/@types/template.types";
import { StyledButton } from "@/components/button";
import SimpleSelectModal, { OptionItem } from "@/components/simpleSelectModal";
import TemplateSearchCard from "@/components/templateSearchCard";
import { Colors } from "@/constants/Colors";
import * as BookTemplateService from "@/service/BookTemplateService";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type FilterType = "title" | "author" | "ISBN";

const FILTER_OPTIONS: OptionItem[] = [
  { label: "Buscar por título", value: "title" },
  { label: "Buscar por autor", value: "author" },
  { label: "Buscar por ISBN", value: "ISBN" },
];

const FILTER_LABELS: Record<FilterType, string> = {
  title: "Buscar por título",
  author: "Buscar por autor",
  ISBN: "Buscar por ISBN",
};

export default function BookSearchScreen() {
  const router = useRouter();
  const { libraryId } = useLocalSearchParams<{ libraryId: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<BookTemplate[]>([]);
  const [filterType, setFilterType] = useState<FilterType>("title");
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setIsLoading(true);
    setResults([]);
    setHasSearched(true);

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
      pathname: "/(full)/book-form",
      params: {
        libraryId: libraryId,
        template: JSON.stringify(template),
      },
    });
  };

  const navigateToExternalSearch = () => {
    router.push({
      pathname: "/(full)/external-book-search",
      params: { libraryId },
    });
  };

  const navigateToBlankForm = () => {
    router.push({
      pathname: "/(full)/book-form",
      params: { libraryId },
    });
  };

  useEffect(() => {
    const placeholder =
      filterType === "title" ? "Crime e castigo..." : filterType === "author" ? "Dostoiévski..." : "9788573266467...";

    setPlaceholder(placeholder);
  }, [filterType]);

  const renderEmptyComponent = () => {
    if (isLoading) return null;
    if (!hasSearched) {
      return <Text style={styles.emptyText}>Busque por templates na sua base de dados.</Text>;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum template interno encontrado.</Text>
        <Text style={styles.emptySubtitle}>O que deseja fazer?</Text>
        <StyledButton title="Buscar em API externa" onPress={navigateToExternalSearch} style={styles.emptyButton} />
        <StyledButton
          title="Preencher do zero"
          onPress={navigateToBlankForm}
          variant="secondary"
          style={styles.emptyButton}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Buscar template" }} />
      <View style={styles.searchBarContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={Colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="filter" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.accent} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TemplateSearchCard template={item} onSelect={() => handleSelectTemplate(item)} />}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}

      <SimpleSelectModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        options={FILTER_OPTIONS}
        title="Selecione o filtro"
        currentValue={filterType}
        onSelect={(value) => {
          setFilterType(value as FilterType);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    height: 50,
  },
  pickerButtonText: {
    color: Colors.text,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
    marginTop: 50,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    fontSize: 16,
    marginTop: 15,
  },
  emptySubtitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyButton: {
    width: "100%",
    marginVertical: 5,
  },
});
