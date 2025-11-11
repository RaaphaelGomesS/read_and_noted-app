import { ExternalBookData, ExternalBookSearchResult } from "@/@types/externalBook.types";
import ISBNScannerModal from "@/components/isbnConnectorModal";
import SimpleSelectModal, { OptionItem } from "@/components/simpleSelectModal";
import TemplateSearchCard from "@/components/templateSearchCard";
import { Colors } from "@/constants/Colors";
import * as ExternalBookService from "@/service/ExternalBookService";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type SearchMode = "title" | "author" | "isbn";

const SEARCH_OPTIONS: OptionItem[] = [
  { label: "Buscar por título", value: "title" },
  { label: "Buscar por autor", value: "author" },
  { label: "Buscar por ISBN", value: "isbn" },
];

export default function ExternalBookSearchScreen() {
  const router = useRouter();
  const { libraryId } = useLocalSearchParams<{ libraryId: string }>();

  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("title");
  const [results, setResults] = useState<ExternalBookSearchResult[]>([]);

  const handleSearch = async (textToSearch: string = searchText) => {
    if (!textToSearch.trim()) return;

    setIsLoading(true);
    setResults([]);

    try {
      let response: ExternalBookSearchResult[] = [];

      if (searchMode === "isbn") {
        response = await ExternalBookService.searchOpenLibraryByISBN(textToSearch.trim());
        setResults(response);
      } else {
        response = await ExternalBookService.searchOpenLibraryByQuery(textToSearch.trim(), searchMode);

        const filteredResponse = response.filter((book) => {
          const hasCover = !!book.img;

          const hasEditions = (book.editionCount || 0) > 0;

          return hasCover && hasEditions;
        });

        setResults(filteredResponse);
      }
    } catch (error: any) {
      Alert.alert("Erro na Busca", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBook = async (itemRawData: any) => {
    if (searchMode === "isbn") {
      router.replace({
        pathname: "/(full)/book-form",
        params: {
          libraryId: libraryId,
          externalBook: JSON.stringify(itemRawData as ExternalBookData),
        },
      });
      return;
    }

    const workKey = itemRawData.workKey;
    if (!workKey) {
      Alert.alert("Erro", "Não foi possível encontrar o identificador desta obra.");
      return;
    }

    router.push({
      pathname: "/(full)/select-edition",
      params: {
        workKey: workKey,
        libraryId: libraryId,
      },
    });
  };

  const handleBarcodeScanned = (isbn: string) => {
    setSearchMode("isbn");
    setSearchText(isbn);
    handleSearch(isbn);
  };

  const getPlaceholder = () => {
    return searchMode === "title"
      ? "Buscar por título..."
      : searchMode === "author"
      ? "Buscar por autor..."
      : "Buscar por ISBN...";
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Buscar na OpenLibrary" }} />

      <View style={styles.searchBarContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder={getPlaceholder()}
            placeholderTextColor={Colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            keyboardType={searchMode === "isbn" ? "numeric" : "default"}
          />
        </View>

        {searchMode === "isbn" && (
          <TouchableOpacity style={styles.filterButton} onPress={() => setIsScannerVisible(true)}>
            <Ionicons name="camera-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.filterButton} onPress={() => setIsModalVisible(true)}>
          <Ionicons name="filter" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.accent} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => item.isbn || `${item.title}-${index}`}
          renderItem={({ item }) => (
            <TemplateSearchCard
              template={{
                id: 0,
                title: item.title,
                author: item.author,
                img: item.img || "",
                isbn: item.isbn || "",
                publisher: "",
                edition: "",
                description: "",
                year: 0,
                pages: 0,
                status: "",
                categories: [],
              }}
              onSelect={() => handleSelectBook(item.raw)}
            />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum livro encontrado na OpenLibrary.</Text>}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}

      <ISBNScannerModal
        visible={isScannerVisible}
        onClose={() => setIsScannerVisible(false)}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <SimpleSelectModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        options={SEARCH_OPTIONS}
        title="Selecione o modo de busca"
        currentValue={searchMode}
        onSelect={(value) => {
          setSearchMode(value as SearchMode);
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
    marginTop: 10,
    height: 50,
  },
  pickerButtonText: {
    color: Colors.text,
    fontSize: 16,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    margin: 20,
    fontSize: 16,
  },
});
