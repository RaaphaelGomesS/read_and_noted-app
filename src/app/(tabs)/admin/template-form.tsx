import { BookTemplateRequest } from "@/@types/template.types";
import { StyledButton } from "@/components/button";
import Input from "@/components/input";
import { Colors } from "@/constants/Colors";
import * as AdminService from "@/service/AdminService";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function TemplateFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ templateId: string }>();
  const templateId = parseInt(params.templateId, 10);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publisher, setPublisher] = useState("");
  const [edition, setEdition] = useState("");
  const [categories, setCategories] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) {
      Alert.alert("Erro", "Nenhum ID de template fornecido.");
      router.back();
      return;
    }

    AdminService.getTemplateDetails(templateId)
      .then((template) => {
        setTitle(template.title);
        setAuthor(template.author);
        setTotalPages(String(template.pages || ""));
        setYear(String(template.year || ""));
        setDescription(template.description || "");
        setIsbn(template.isbn || "");
        setPublisher(template.publisher || "");
        setEdition(template.edition || "");
        setCategories(template.categories?.join(", ") || "");
        setImageUri(template.img || null);
        setIsFetching(false);
      })
      .catch((err) => {
        Alert.alert("Erro", err.message);
        router.back();
      });
  }, [templateId]);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title || !author) {
      Alert.alert("Erro", "Título e Autor são obrigatórios.");
      return;
    }

    setIsLoading(true);

    const templateRequest: BookTemplateRequest = {
      templateId: templateId,
      title: title,
      author: author,
      pages: parseInt(totalPages, 10) || 0,
      year: parseInt(year, 10) || 0,
      description: description,
      isbn: isbn,
      publisher: publisher,
      edition: edition,
      categories: categories
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      await AdminService.updateTemplate(templateRequest, imageUri || undefined);
      Alert.alert("Sucesso", "Template atualizado.", [{ text: "OK", onPress: () => router.back() }]);
    } catch (error: any) {
      Alert.alert("Erro ao Salvar", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Stack.Screen options={{ title: "Editar template" }} />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.coverContainer} onPress={handleImagePick}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons name="image-outline" size={50} color={Colors.textSecondary} />
            </View>
          )}
        </TouchableOpacity>

        <Input placeholder="Título" value={title} onChangeText={setTitle} />
        <Input placeholder="Autor" value={author} onChangeText={setAuthor} />
        <Input placeholder="ISBN" value={isbn} onChangeText={setIsbn} keyboardType="number-pad" />

        <View style={styles.inputRow}>
          <Input placeholder="Editora" value={publisher} onChangeText={setPublisher} style={styles.flexInput} />
          <Input placeholder="Edição" value={edition} onChangeText={setEdition} style={styles.flexInput} />
        </View>

        <View style={styles.inputRow}>
          <Input
            placeholder="Páginas totais"
            value={totalPages}
            onChangeText={setTotalPages}
            keyboardType="number-pad"
            style={styles.flexInput}
          />
          <Input
            placeholder="Ano"
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            style={styles.flexInput}
          />
        </View>

        <Input
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.textArea}
        />
        <Input placeholder="Categorias (separadas por vírgula)" value={categories} onChangeText={setCategories} />

        <View style={[styles.inputRow, { marginTop: 20 }]}>
          <StyledButton
            title="Cancelar"
            variant="secondary"
            onPress={() => router.back()}
            style={[styles.flexButton, styles.flexCancelButton]}
          />
          <StyledButton title="Salvar alterações" onPress={handleSave} style={styles.flexButton} loading={isLoading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 50,
  },
  coverContainer: {
    width: 150,
    height: 220,
    alignSelf: "center",
    marginBottom: 20,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "47.7%",
    gap: 20,
  },
  flexInput: {
    flex: 1,
    marginBottom: 0,
    width: "100%",
    backgroundColor: Colors.card,
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.boder,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 18,
    backgroundColor: Colors.card,
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.boder,
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
