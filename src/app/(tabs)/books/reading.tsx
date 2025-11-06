import { Book, BookResponse } from "@/@types/auth.types";
import AddBookModal from "@/components/addBookModal";
import BookCard from "@/components/bookCard";
import EditPagesModal from "@/components/editPagesModal";
import FloatingActionButton from "@/components/floatingButton";
import { Colors } from "@/constants/Colors";
import { useLibrary } from "@/context/LibraryContext";
import * as BookService from "@/service/BookService";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";

const mapApiToUi = (apiBook: BookResponse): Book => {
  return {
    id: apiBook.id,
    title: apiBook.title,
    author: apiBook.author,
    img: apiBook.img,
    status: apiBook.status,
    readPages: apiBook.pages,
    rating: apiBook.rating,
    startedDate: apiBook.startedDate || undefined,
    finishedDate: apiBook.finishedDate || undefined,
    totalPages: apiBook.totalPages,
  };
};

export default function LendoScreen() {
  const router = useRouter();

  const { selectedLibraryId, isLoading: isLibraryLoading } = useLibrary();

  const [books, setBooks] = useState<Book[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReadingBooks = async (libId: number, page: number) => {
    if (page === 0) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const response = await BookService.getReadingBooks(libId, page);
      const newBooks = response.data.map(mapApiToUi);

      setBooks((prev) => (page === 0 ? newBooks : [...prev, ...newBooks]));
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (isLibraryLoading) {
        setIsLoading(true);
        return;
      }

      if (selectedLibraryId) {
        fetchReadingBooks(selectedLibraryId, 0);
      } else {
        Alert.alert("Nenhuma biblioteca selecionada", "Selecione uma biblioteca primeiro.", [
          { text: "OK", onPress: () => router.replace("/library") },
        ]);
      }
    }, [selectedLibraryId, isLibraryLoading])
  );

  const loadMoreBooks = () => {
    if (isFetchingMore || currentPage >= totalPages - 1) return;
    if (selectedLibraryId) {
      fetchReadingBooks(selectedLibraryId, currentPage + 1);
    }
  };

  const handleEditPress = (book: Book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedBook(null);
  };

  const handleSavePages = (pages: number) => {
    if (!selectedBook) return;
    // TODO: Chamar a API POST /book/update
    console.log(`Salvando livro ${selectedBook.id} com ${pages} páginas...`);
    setBooks((currentBooks) => currentBooks.map((b) => (b.id === selectedBook.id ? { ...b, readPages: pages } : b)));
    handleCloseModal();
  };

  const handleBookPress = (book: Book) => {
    console.log(`Navegando para detalhes do livro: ${book.id}`);
    // router.push(`/books/${book.id}`); // Próximo passo: criar a tela de detalhes
  };

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return <ActivityIndicator size="small" color={Colors.accent} style={{ marginVertical: 20 }} />;
  };

  if (isLoading || isLibraryLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            status="lendo"
            onPress={() => handleBookPress(item)}
            onEditPress={() => handleEditPress(item)}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum livro sendo lido.</Text>}
        contentContainerStyle={books.length === 0 ? styles.center : { paddingBottom: 100 }}
        onEndReached={loadMoreBooks}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        onRefresh={() => (selectedLibraryId ? fetchReadingBooks(selectedLibraryId, 0) : null)}
        refreshing={isLoading}
      />

      <FloatingActionButton onPress={() => setIsAddModalVisible(true)} iconName="add" />

      <AddBookModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onNavigateToSearch={() => {
          router.push({
            pathname: "/(full)/book-search",
            params: { libraryId: selectedLibraryId },
          });
        }}
        onNavigateToForm={() => {
          router.push({
            pathname: "/(full)/book-form",
            params: { libraryId: selectedLibraryId },
          });
        }}
      />

      {selectedBook && (
        <EditPagesModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          onSubmit={handleSavePages}
          bookTitle={selectedBook.title}
          currentPages={selectedBook.readPages}
          totalPages={selectedBook.totalPages}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.background,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
