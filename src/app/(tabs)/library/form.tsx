import { StyledButton } from "@/components/button";
import Input from "@/components/input";
import { Colors } from "@/constants/Colors";
import * as LibraryService from "@/service/LibraryService";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";

export default function LibraryFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ libraryId?: string }>();
  const libraryId = params.libraryId ? parseInt(params.libraryId, 10) : null;
  const isEditing = libraryId !== null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);

  useEffect(() => {
    const fetchLibraryData = async () => {
      if (isEditing && libraryId) {
        setIsFetching(true);
        try {
          const library = await LibraryService.getLibraryById(libraryId);
          setName(library.name);
          setDescription(library.description || "");
        } catch (error) {
          console.error("Erro ao buscar dados da biblioteca:", error);
          Alert.alert("Erro", "Não foi possível carregar os dados da biblioteca para edição.");
          router.back();
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchLibraryData();
  }, [libraryId, isEditing, router]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "O nome da biblioteca não pode estar vazio.");
      return;
    }

    setIsLoading(true);
    try {
      const libraryData = { id: libraryId ?? undefined, name, description };
      if (isEditing) {
        await LibraryService.updateLibrary(libraryData as { id: number; name: string; description: string });
      } else {
        await LibraryService.createLibrary(libraryData);
      }
      router.back();
    } catch (error: any) {
      console.error("Erro ao salvar biblioteca:", error);
      Alert.alert("Erro", error.message || "Não foi possível salvar a biblioteca.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isFetching) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Stack.Screen options={{ title: isEditing ? "Editar Biblioteca" : "Criar Biblioteca" }} />
        <View>
          <Input
            placeholder="Nome da Biblioteca"
            value={name}
            onChangeText={setName}
            placeholderTextColor={Colors.textSecondary}
          />
          <Input
            placeholder="Descrição (Opcional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.descriptionInput}
            placeholderTextColor={Colors.textSecondary}
          />
          <View>
            <StyledButton title="Cancelar" variant="secondary" onPress={handleCancel} disabled={isLoading} />
            <StyledButton title={isLoading ? "Salvando..." : "Salvar"} onPress={handleSave} disabled={isLoading} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 18,
    width: "100%",
    backgroundColor: Colors.card,
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 10,
    fontSize: 16,
    borderColor: Colors.accent,
  }
});
