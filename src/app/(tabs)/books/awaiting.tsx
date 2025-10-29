import { Book } from '@/@types/auth.types';
import BookCard from '@/components/bookCard';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const DUMMY_BOOKS: Book[] = [
  {
    id: 3,
    title: 'No café existencialista',
    author: 'Sarah Bakewell',
    img: 'https://exemplo.com/capa3.jpg',
    readPages: 0,
    totalPages: 350,
  },
];

export default function AguardandoScreen() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(DUMMY_BOOKS);
  }, []);

  const handleBookPress = (book: Book) => {
    console.log(`Navegando para detalhes do livro: ${book.id}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            status="aguardando"
            onPress={() => handleBookPress(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum livro na fila.</Text>
        }
      />
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