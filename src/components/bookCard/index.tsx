import { Book, BookStatus } from "@/@types/book.types";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type BookCardProps = {
  book: Book;
  status: BookStatus;
  onPress: () => void;
  onEditPress?: () => void;
};

const BookCard = ({ book, status, onPress, onEditPress }: BookCardProps) => {
  const progress = book.totalPages > 0 ? (book.readPages / book.totalPages) * 100 : 0;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <Image source={{ uri: book.img }} style={styles.coverImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        {status === "lendo" && (
          <View style={styles.progressWrapper}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.floor(progress)}%</Text>
          </View>
        )}
      </View>
      {status === "lendo" && (
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Ionicons name="create-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  coverImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  progressWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#555",
    borderRadius: 4,
    marginRight: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.text,
    minWidth: 30,
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
  },
});

export default BookCard;
