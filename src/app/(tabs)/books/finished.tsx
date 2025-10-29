import { Book } from '@/@types/auth.types';
import BookCard from '@/components/bookCard';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const DUMMY_BOOKS: Book[] = [];

export default function FinalizadoScreen() {
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
            status="finalizado"
            onPress={() => handleBookPress(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum livro finalizado.</Text>
        }
      />
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
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});