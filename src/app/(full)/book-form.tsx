import { BookCreateRequest, BookRequest, BookTemplate, BookTemplateRequest } from "@/@types/auth.types";
import { StyledButton } from "@/components/button";
import Input from "@/components/input";
import { Colors } from "@/constants/Colors";
import * as BookService from "@/service/BookService";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type BookStatus = "WANT_TO_READ" | "READING" | "READ" | "DROPPED";
const statusDisplayMap: Record<BookStatus, string> = {
  WANT_TO_READ: "Aguardando",
  READING: "Lendo",
  READ: "Finalizado",
  DROPPED: "Parado",
};

export default function BookFormScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{ libraryId: string; template?: string }>();

  const [template, setTemplate] = useState<BookTemplate | null>(null);
  const [isTemplateFieldsDisabled, setIsTemplateFieldsDisabled] = useState(false);

  // Template
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

  //Livro
  const [status, setStatus] = useState<BookStatus>("WANT_TO_READ");
  const [readPages, setReadPages] = useState("");
  const [rating, setRating] = useState("");
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [finishedAt, setFinishedAt] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showFinishDatePicker, setShowFinishDatePicker] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.template) {
      const parsedTemplate = JSON.parse(params.template) as BookTemplate;
      setTemplate(parsedTemplate);
      setIsTemplateFieldsDisabled(true);

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

  const handleSave = async () => {
    const libId = parseInt(params.libraryId, 10);
    if (!libId || !title || !author) {
      Alert.alert("Erro", "Biblioteca, Título e Autor são obrigatórios.");
      return;
    }

    setIsLoading(true);

    const templateRequest: BookTemplateRequest =
      isTemplateFieldsDisabled && template
        ? { templateId: template.id }
        : {
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

    const bookRequest: BookRequest = {
      libraryId: libId,
      status: status,
      pages: parseInt(readPages, 10) || 0,
      rating: parseInt(rating, 10) || 0,
      startedDate: startedAt ? startedAt.toISOString() : null,
      finishedDate: finishedAt ? finishedAt.toISOString() : null,
    };

    // Monta o DTO final
    const createRequest: BookCreateRequest = {
      book: bookRequest,
      template: templateRequest,
    };

    try {
      // Envia para a API de serviço (que lida com o FormData)
      await BookService.createBook(createRequest, imageUri || undefined);
      router.back(); // Volta para a tela anterior
    } catch (error: any) {
      Alert.alert("Erro ao Salvar", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Funções do DatePicker ---
  const onStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) setStartedAt(selectedDate);
  };
  const onFinishDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowFinishDatePicker(false);
    if (selectedDate) setFinishedAt(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isTemplateFieldsDisabled ? "Adicionar Livro" : "Formulário Completo" }} />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={styles.coverContainer}
          onPress={() => {
            /* TODO: Image Picker */
          }}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons name="image-outline" size={50} color={Colors.textSecondary} />
              <Text style={styles.coverPlaceholderText}>Adicionar Capa</Text>
            </View>
          )}
        </TouchableOpacity>

        <Input placeholder="Título" value={title} onChangeText={setTitle} editable={!isTemplateFieldsDisabled} />
        <Input placeholder="Autor" value={author} onChangeText={setAuthor} editable={!isTemplateFieldsDisabled} />
        <View style={styles.row}>
          <Input
            placeholder="Páginas Totais"
            value={totalPages}
            onChangeText={setTotalPages}
            keyboardType="number-pad"
            style={styles.flexInput}
            editable={!isTemplateFieldsDisabled}
          />
          <Input
            placeholder="Ano"
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            style={styles.flexInput}
            editable={!isTemplateFieldsDisabled}
          />
        </View>
        <Input
          placeholder="Editora"
          value={publisher}
          onChangeText={setPublisher}
          editable={!isTemplateFieldsDisabled}
        />
        <View style={styles.row}>
          <Input
            placeholder="ISBN"
            value={isbn}
            onChangeText={setIsbn}
            keyboardType="number-pad"
            style={styles.flexInput}
            editable={!isTemplateFieldsDisabled}
          />
          <Input
            placeholder="Edição"
            value={edition}
            onChangeText={setEdition}
            style={styles.flexInput}
            editable={!isTemplateFieldsDisabled}
          />
        </View>
        <Input
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.textArea}
          editable={!isTemplateFieldsDisabled}
        />
        <Input
          placeholder="Categorias (separadas por vírgula)"
          value={categories}
          onChangeText={setCategories}
          editable={!isTemplateFieldsDisabled}
        />

        <View style={styles.divider} />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          {(Object.keys(statusDisplayMap) as BookStatus[]).map((key) => (
            <TouchableOpacity
              key={key}
              style={[styles.statusButton, status === key && styles.statusButtonActive]}
              onPress={() => setStatus(key)}
            >
              <Text style={[styles.statusText, status === key && styles.statusTextActive]}>
                {statusDisplayMap[key]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input placeholder="Páginas Lidas" value={readPages} onChangeText={setReadPages} keyboardType="number-pad" />

        <View style={styles.row}>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowStartDatePicker(true)}>
            <Text style={styles.datePickerText}>
              {startedAt ? `Início: ${startedAt.toLocaleDateString()}` : "Data de Início"}
            </Text>
          </TouchableOpacity>

          {status === "READ" && (
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowFinishDatePicker(true)}>
              <Text style={styles.datePickerText}>
                {finishedAt ? `Término: ${finishedAt.toLocaleDateString()}` : "Data de Término"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {status === "READ" && (
          <Input
            placeholder="Avaliação (1-5)"
            value={rating}
            onChangeText={setRating}
            keyboardType="number-pad"
            maxLength={1}
          />
        )}

        <View style={[styles.row, { marginTop: 20 }]}>
          <StyledButton title="Cancelar" variant="secondary" onPress={() => router.back()} style={styles.flexInput} />
          <StyledButton title="Salvar" onPress={handleSave} style={styles.flexInput} loading={isLoading} />
        </View>

        {showStartDatePicker && (
          <DateTimePicker value={startedAt || new Date()} mode="date" display="default" onChange={onStartDateChange} />
        )}
        {showFinishDatePicker && (
          <DateTimePicker
            value={finishedAt || new Date()}
            mode="date"
            display="default"
            onChange={onFinishDateChange}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContainer: { padding: 16, paddingBottom: 50 },
  coverContainer: { width: 150, height: 220, alignSelf: "center", marginBottom: 20 },
  coverImage: { width: "100%", height: "100%", borderRadius: 10 },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  coverPlaceholderText: { color: Colors.textSecondary, marginTop: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  flexInput: { flex: 1, marginBottom: 0 }, // Remove margem de baixo para linhas
  textArea: { height: 120, textAlignVertical: "top", paddingTop: 18 },
  divider: { height: 1, backgroundColor: Colors.card, marginVertical: 20 },
  label: { color: Colors.textSecondary, fontSize: 16, marginLeft: 4, marginBottom: 8 },
  statusContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16, gap: 10 },
  statusButton: { flex: 1, paddingVertical: 12, backgroundColor: Colors.card, borderRadius: 8, alignItems: "center" },
  statusButtonActive: { backgroundColor: Colors.accent },
  statusText: { color: Colors.textSecondary, fontWeight: "500" },
  statusTextActive: { color: Colors.white, fontWeight: "bold" },
  datePickerButton: { flex: 1, backgroundColor: Colors.card, padding: 18, borderRadius: 10, alignItems: "center" },
  datePickerText: { color: Colors.textSecondary, fontSize: 16 },
});
