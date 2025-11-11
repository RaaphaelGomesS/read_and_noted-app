import { SuggestionRequest } from "@/@types/suggestion.type";
import { BookTemplate } from "@/@types/template.types";
import { StyledButton } from "@/components/button";
import Input from "@/components/input";
import { Colors } from "@/constants/Colors";
import * as BookService from "@/service/BookService";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SuggestionFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ template: string }>();

  const [template, setTemplate] = useState<BookTemplate | null>(null);

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
  const [reason, setReason] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.template) {
      const parsedTemplate = JSON.parse(params.template) as BookTemplate;
      setTemplate(parsedTemplate);

      setTitle(parsedTemplate.title);
      setAuthor(parsedTemplate.author);
      setTotalPages(String(parsedTemplate.pages || 0));
      setYear(String(parsedTemplate.year || ""));
      setDescription(parsedTemplate.description || "");
      setIsbn(parsedTemplate.isbn || "");
      setPublisher(parsedTemplate.publisher || "");
      setEdition(parsedTemplate.edition || "");
      setCategories(parsedTemplate.categories?.join(", ") || "");
      setImageUri(parsedTemplate.img || null);
    }
  }, [params.template]);

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
    if (!template) return;

    if (!reason.trim()) {
      Alert.alert("Erro", "O motivo da sugestão é obrigatório.");
      return;
    }
    if (!title.trim() || !author.trim()) {
      Alert.alert("Erro", "Título e Autor são obrigatórios.");
      return;
    }

    setIsLoading(true);

    const suggestionRequest: SuggestionRequest = {
      templateId: template.id,
      suggestedTitle: title,
      suggestedAuthor: author,
      suggestedPages: parseInt(totalPages, 10) || 0,
      suggestedYear: parseInt(year, 10) || 0,
      suggestedDescription: description,
      suggestedISBN: isbn,
      suggestedPublisher: publisher,
      suggestedEdition: edition,
      suggestedCategories: categories
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      suggestedReason: reason,
    };

    try {
      await BookService.createSuggestion(suggestionRequest, imageUri || undefined);
      Alert.alert("Sucesso", "Sugestão enviada para análise.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/library") },
      ]);
    } catch (error: any) {
      Alert.alert("Erro ao Salvar", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.coverContainer} onPress={handleImagePick}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons name="image-outline" size={50} color={Colors.textSecondary} />
              <Text style={styles.coverPlaceholderText}>Alterar capa</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Motivo da sugestão (Obrigatório)</Text>
        <Input
          placeholder="Ex: Corrigir o número de páginas, ano, etc."
          value={reason}
          onChangeText={setReason}
          multiline
          style={styles.textArea}
        />

        <View style={styles.divider} />
        <Text style={styles.label}>Dados do Template (Editáveis)</Text>

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
          <StyledButton title="Enviar sugestão" onPress={handleSave} style={styles.flexButton} loading={isLoading} />
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
  coverPlaceholderText: {
    color: Colors.textSecondary,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
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
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "47.7%",
    gap: 20,
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
  label: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginLeft: 4,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.card,
    marginVertical: 20,
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
