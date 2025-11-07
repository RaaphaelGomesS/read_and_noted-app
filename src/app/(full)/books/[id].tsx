import { BookRequest, FullBookResponse } from "@/@types/book.types";
import { StyledButton } from "@/components/button";
import Input from "@/components/input";
import OptionsModal from "@/components/optionsModal";
import { Colors } from "@/constants/Colors";
import * as BookService from "@/service/BookService";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type BookStatus = "WANT_TO_READ" | "READING" | "READ" | "DROPPED";
const statusDisplayMap: Record<BookStatus, string> = {
  WANT_TO_READ: "Aguardando",
  READING: "Lendo",
  READ: "Finalizado",
  DROPPED: "Parado",
};

export default function BookDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const bookId = parseInt(params.id, 10);

  const [book, setBook] = useState<FullBookResponse["book"] | null>(null);
  const [template, setTemplate] = useState<FullBookResponse["template"] | null>(null);
  const [isTemplateFieldsDisabled, setIsTemplateFieldsDisabled] = useState(true);

  // Estados do Template
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

  // Estados do Livro
  const [status, setStatus] = useState<BookStatus>("WANT_TO_READ");
  const [readPages, setReadPages] = useState("");
  const [rating, setRating] = useState("");
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [finishedAt, setFinishedAt] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showFinishDatePicker, setShowFinishDatePicker] = useState(false);

  // Estados de controle
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isOptionsModalVisible, setOptionsModalVisible] = useState(false);

  useEffect(() => {
    if (!bookId) {
      Alert.alert("Erro", "ID do livro não encontrado.");
      router.back();
      return;
    }

    setIsFetching(true);
    BookService.getBookById(bookId)
      .then((data) => {
        const { book: apiBook, template: apiTemplate } = data;

        setBook(apiBook);
        setTemplate(apiTemplate);

        //Template
        setTitle(apiTemplate.title);
        setAuthor(apiTemplate.author);
        setTotalPages(String(apiTemplate.pages || 0));
        setYear(String(apiTemplate.year || ""));
        setDescription(apiTemplate.description || "");
        setIsbn(apiTemplate.isbn || "");
        setPublisher(apiTemplate.publisher || "");
        setEdition(apiTemplate.edition || "");
        setCategories(apiTemplate.categories?.join(", ") || "");
        setImageUri(apiTemplate.img || null);

        //Livro
        setStatus(apiBook.status.toUpperCase() as BookStatus);
        setReadPages(String(apiBook.pages || 0));
        setRating(String(apiBook.rating || ""));
        setStartedAt(apiBook.startedDate ? new Date(apiBook.startedDate) : null);
        setFinishedAt(apiBook.finishedDate ? new Date(apiBook.finishedDate) : null);
      })
      .catch((err) => {
        Alert.alert("Erro", err.message);
        router.back();
      })
      .finally(() => setIsFetching(false));
  }, [bookId]);

  const handleSave = async () => {
    if (!book) return;
    setIsLoading(true);

    const bookRequest: BookRequest = {
      id: book.id,
      libraryId: book.libraryId,
      status: status,
      pages: parseInt(readPages, 10) || 0,
      rating: parseInt(rating, 10) || 0,
      startedDate: startedAt ? startedAt.toISOString() : null,
      finishedDate: finishedAt ? finishedAt.toISOString() : null,
    };

    try {
      await BookService.updateBook(bookRequest);
      router.back();
    } catch (error: any) {
      Alert.alert("Erro ao Atualizar", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!book) return;
    Alert.alert("Confirmar Exclusão", `Tem certeza que deseja excluir "${book.title}" da sua biblioteca?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await BookService.deleteBook(book.id);
            router.back();
          } catch (error: any) {
            Alert.alert("Erro ao Excluir", error.message);
          }
        },
      },
    ]);
  };

  const handleSuggest = () => {
    if (!template) return;
    router.push({
      pathname: "/(full)/suggestion-form",
      params: { template: JSON.stringify(template) },
    });
  };

  const modalOptions = [
    { label: "Criar sugestão de melhoria", onPress: handleSuggest },
    { label: "Excluir livro da biblioteca", onPress: handleDelete, isDestructive: true },
  ];

  const onStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) setStartedAt(selectedDate);
  };
  const onFinishDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowFinishDatePicker(false);
    if (selectedDate) setFinishedAt(selectedDate);
  };

  if (isFetching || !book || !template) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Detalhes do Livro",
          headerRight: () => (
            <TouchableOpacity onPress={() => setOptionsModalVisible(true)} style={{ padding: 8 }}>
              <Ionicons name="ellipsis-horizontal" size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.coverContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons name="image-outline" size={50} color={Colors.textSecondary} />
            </View>
          )}
        </View>

        <Input placeholder="Título" value={title} editable={!isTemplateFieldsDisabled} />
        <Input placeholder="Autor" value={author} editable={!isTemplateFieldsDisabled} />
        <View style={styles.row}>
          <Input
            placeholder="Páginas Totais"
            value={totalPages}
            style={styles.flexInput}
            editable={!isTemplateFieldsDisabled}
          />
          <Input placeholder="Ano" value={year} style={styles.flexInput} editable={!isTemplateFieldsDisabled} />
        </View>
        <Input placeholder="Editora" value={publisher} editable={!isTemplateFieldsDisabled} />
        <View style={styles.row}>
          <Input placeholder="ISBN" value={isbn} style={styles.flexInput} editable={!isTemplateFieldsDisabled} />
          <Input placeholder="Edição" value={edition} style={styles.flexInput} editable={!isTemplateFieldsDisabled} />
        </View>
        <Input
          placeholder="Descrição"
          value={description}
          multiline
          style={styles.textArea}
          editable={!isTemplateFieldsDisabled}
        />
        <Input placeholder="Categorias" value={categories} editable={!isTemplateFieldsDisabled} />

        <View style={styles.divider} />

        <Text style={styles.label}>Meu Progresso</Text>
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
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowFinishDatePicker(true)}>
            <Text style={styles.datePickerText}>
              {finishedAt ? `Término: ${finishedAt.toLocaleDateString()}` : "Data de Término"}
            </Text>
          </TouchableOpacity>
        </View>

        <Input
          placeholder="Avaliação (1-5)"
          value={rating}
          onChangeText={setRating}
          keyboardType="number-pad"
          maxLength={1}
        />

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

      <OptionsModal
        visible={isOptionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        options={modalOptions}
      />
    </View>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  flexInput: {
    flex: 1,
    marginBottom: 0,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.card,
    marginVertical: 20,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginLeft: 4,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    gap: 10,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderRadius: 8,
    alignItems: "center",
  },
  statusButtonActive: {
    backgroundColor: Colors.accent,
  },
  statusText: {
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  statusTextActive: {
    color: Colors.white,
    fontWeight: "bold",
  },
  datePickerButton: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  datePickerText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
