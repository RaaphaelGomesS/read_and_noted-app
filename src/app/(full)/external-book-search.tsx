import { ExternalBookData, ExternalBookSearchResult } from "@/@types/externalBook.types";
import ISBNScannerModal from "@/components/isbnConnectorModal";
import TemplateSearchCard from "@/components/templateSearchCard";
import { Colors } from "@/constants/Colors";
import * as ExternalBookService from "@/service/ExternalBookService";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type SearchMode = "query" | "isbn";

export default function ExternalBookSearchScreen() {
  const router = useRouter();
  const { libraryId } = useLocalSearchParams<{ libraryId: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ExternalBookSearchResult[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("query");
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  const handleSearch = async (textToSearch: string = searchText) => {
    if (!textToSearch.trim()) return;

    setIsLoading(true);
    setResults([]);

    try {
      let response: ExternalBookSearchResult[] = [];
      if (searchMode === "query") {
        response = await ExternalBookService.searchOpenLibraryByQuery(textToSearch.trim());
      } else {
        response = await ExternalBookService.searchOpenLibraryByISBN(textToSearch.trim());
      }
      setResults(response);
    } catch (error: any) {
      Alert.alert("Erro na Busca", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBook = (bookData: ExternalBookData) => {
    router.replace({
      pathname: "/(full)/book-form",
      params: {
        libraryId: libraryId,
        externalBook: JSON.stringify(bookData),
      },
    });
  };

  const handleBarcodeScanned = (isbn: string) => {
    setSearchMode("isbn");
    setSearchText(isbn);
    handleSearch(isbn);
  };

  const getPlaceholder = () => {
    return searchMode === "query" ? "Buscar por título ou autor..." : "Buscar por ISBN...";
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Buscar na OpenLibrary" }} />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={searchMode}
          onValueChange={(itemValue) => setSearchMode(itemValue)}
          style={styles.picker}
          dropdownIconColor={Colors.text}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Buscar por Título/Autor" value="query" color={Colors.text} />
          <Picker.Item label="Buscar por ISBN" value="isbn" color={Colors.text} />
        </Picker>
      </View>

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
  searchIcon: { marginRight: 8 },
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
  pickerContainer: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  picker: {
    color: Colors.text,
    height: 50,
  },
  pickerItem: {
    color: Colors.text,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
