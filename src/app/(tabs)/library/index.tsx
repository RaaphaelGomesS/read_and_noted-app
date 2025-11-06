import { Library } from "@/@types/auth.types";
import FloatingActionButton from "@/components/floatingButton";
import LibraryCard from "@/components/libraryCard";
import OptionsModal from "@/components/optionsModal";
import { Colors } from "@/constants/Colors";
import { useLibrary } from "@/context/LibraryContext";
import { AuthError } from "@/service/HandlerApiException";
import * as LibraryService from "@/service/LibraryService";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";

export default function LibraryScreen() {
  const router = useRouter();
  const { selectLibrary } = useLibrary();

  const [libraries, setLibraries] = useState<Library[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);

  const fetchLibraries = async () => {
    setIsLoading(true);
    try {
      const response = await LibraryService.getAllLibraries(0, 50);
      setLibraries(response.libraries);
    } catch (error) {
      console.error("Erro ao buscar bibliotecas:", error);
      if (!(error instanceof AuthError)) {
        Alert.alert("Erro", "Não foi possível carregar suas bibliotecas.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLibraries();
    }, [])
  );

  const handleOptionsPress = (library: Library) => {
    setSelectedLibrary(library);
    setModalVisible(true);
  };

  const handleEdit = () => {
    if (selectedLibrary) {
      router.push({
        pathname: "/library/form",
        params: { libraryId: selectedLibrary.id },
      });
    }
  };

  const handleDelete = () => {
    if (selectedLibrary) {
      Alert.alert(
        "Confirmar Exclusão",
        `Tem certeza que deseja excluir a biblioteca "${selectedLibrary.name}"? Todos os livros nela serão perdidos.`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: async () => {
              try {
                if (selectedLibrary?.id) {
                  await LibraryService.deleteLibrary(selectedLibrary.id);
                  fetchLibraries();
                } else {
                  console.error("ID da biblioteca selecionada é inválido.");
                  Alert.alert("Erro", "Não foi possível excluir a biblioteca.");
                }
              } catch (error) {
                console.error("Erro ao excluir biblioteca:", error);
                Alert.alert("Erro", "Não foi possível excluir a biblioteca.");
              }
            },
          },
        ]
      );
    }
  };

  const handleCardPress = async (library: Library) => {
    await selectLibrary(library.id);

    router.push("/books/reading");
  };

  const handleAddPress = () => {
    router.push("/library/form");
  };

  const modalOptions = [
    { label: "Editar", onPress: handleEdit },
    { label: "Excluir", onPress: handleDelete, isDestructive: true },
  ];

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={libraries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <LibraryCard
            library={item}
            onPress={() => handleCardPress(item)}
            onOptionsPress={() => handleOptionsPress(item)}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma biblioteca encontrada. Crie uma nova!</Text>}
        contentContainerStyle={libraries.length === 0 ? styles.center : { paddingBottom: 100 }}
        onRefresh={fetchLibraries}
        refreshing={isLoading}
      />

      <FloatingActionButton onPress={handleAddPress} iconName="add" />

      <OptionsModal visible={isModalVisible} onClose={() => setModalVisible(false)} options={modalOptions} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
