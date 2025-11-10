import { BookRequest, BookStatus, FullBookResponse } from "@/@types/book.types";
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

const statusDisplayMap: Record<BookStatus, string> = {
  aguardando: "Aguardando",
  lendo: "Lendo",
  finalizado: "Finalizado",
  parado: "Parado",
};

export default function BookDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const bookId = parseInt(params.id, 10);

  const [book, setBook] = useState<FullBookResponse["book"] | null>(null);
  const [template, setTemplate] = useState<FullBookResponse["template"] | null>(null);

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

  const [status, setStatus] = useState<BookStatus>("aguardando");
  const [readPages, setReadPages] = useState("");
  const [rating, setRating] = useState("");
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [finishedAt, setFinishedAt] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showFinishDatePicker, setShowFinishDatePicker] = useState(false);

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
        setStatus(apiBook.status as BookStatus);
        setReadPages(String(apiBook.pages || ""));
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
    Alert.alert("Confirmar exclusão", `Tem certeza que deseja excluir "${book.title}" da sua biblioteca?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await BookService.deleteBook(book.id);
            router.back();
          } catch (error: any) {
            Alert.alert("Erro ao excluir", error.message);
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
          title: "Detalhes do livro",
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

        <Input placeholder="Título" value={title} editable={false} />
        <Input placeholder="Autor" value={author} editable={false} />
        <Input placeholder="ISBN" value={isbn} editable={false} />

        <View style={styles.inputRow}>
          <Input placeholder="Editora" value={publisher} style={styles.flexInput} editable={false} />
          <Input placeholder="Edição" value={edition} style={styles.flexInput} editable={false} />
        </View>

        <View style={styles.inputRow}>
          <Input placeholder="Páginas totais" value={totalPages} style={styles.flexInput} editable={false} />
          <Input placeholder="Ano" value={year} style={styles.flexInput} editable={false} />
        </View>

        <Input
          placeholder="Descrição"
          value={description}
          placeholderTextColor={Colors.inactive}
          multiline
          style={styles.textArea}
          editable={false}
        />
        <Input placeholder="Categorias" value={categories} editable={false} />

        <View style={styles.divider} />

        <Text style={styles.label}>Meu progresso</Text>
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

        {status === "lendo" && (
          <Input placeholder="Páginas lidas" value={readPages} onChangeText={setReadPages} keyboardType="number-pad" />
        )}

        <View style={styles.row}>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowStartDatePicker(true)}>
            <Text style={styles.datePickerText}>
              {startedAt ? `Início: ${startedAt.toLocaleDateString()}` : "Data de início"}
            </Text>
          </TouchableOpacity>

          {status === "finalizado" && (
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowFinishDatePicker(true)}>
              <Text style={styles.datePickerText}>
                {finishedAt ? `Término: ${finishedAt.toLocaleDateString()}` : "Data de término"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {status === "finalizado" && (
          <Input
            placeholder="Avaliação (1-5)"
            value={rating}
            onChangeText={setRating}
            keyboardType="number-pad"
            style={styles.ratingInput}
            maxLength={1}
          />
        )}

        <View style={[styles.inputRow, { marginTop: 20 }]}>
          <StyledButton
            title="Cancelar"
            variant="secondary"
            onPress={() => router.back()}
            style={[styles.flexButton, styles.flexCancelButton]}
          />
          <StyledButton title="Salvar" onPress={handleSave} style={styles.flexButton} loading={isLoading} />
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
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "47.7%",
    gap: 20,
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
    color: Colors.inactive,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 10,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 18,
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 10,
    fontSize: 16,
    color: Colors.inactive,
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
    borderColor: Colors.boder,
    borderWidth: 1,
  },
  datePickerText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  ratingInput: {
    marginTop: 18,
    marginBottom: -20,
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
