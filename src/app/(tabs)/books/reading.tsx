import { Book } from '@/@types/auth.types';
import BookCard from '@/components/bookCard';
import EditPagesModal from '@/components/editPagesModal';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const DUMMY_BOOKS: Book[] = [
  {
    id: 1,
    title: 'O Deserto dos Tártaros',
    author: 'Dino Buzzati',
    img: 'https://exemplo.com/capa1.jpg',
    readPages: 125,
    totalPages: 198,
  },
  {
    id: 2,
    title: 'Memórias Póstumas de Braz Cubas',
    author: 'Machado de Assis',
    img: 'https://exemplo.com/capa2.jpg',
    readPages: 20,
    totalPages: 200,
  },
];

export default function LendoScreen() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    setBooks(DUMMY_BOOKS);
  }, []);

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

    console.log(
      `Salvando livro ${selectedBook.id} com ${pages} páginas...`
    );

    setBooks((currentBooks) =>
      currentBooks.map((b) =>
        b.id === selectedBook.id ? { ...b, readPages: pages } : b
      )
    );
    handleCloseModal();
  };

  const handleBookPress = (book: Book) => {
    console.log(`Navegando para detalhes do livro: ${book.id}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen />
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum livro sendo lido.</Text>
        }
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
    backgroundColor: '#1C1C1E',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});