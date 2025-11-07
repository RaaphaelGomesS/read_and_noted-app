import { BookSummary } from "@/@types/statistics.types";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RecommendationCardProps = {
  book: BookSummary;
};

const RecommendationCard = ({ book }: RecommendationCardProps) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image
        source={{ uri: book.img || undefined }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
  },
  image: {
    width: 50,
    height: 75,
    borderRadius: 4,
    backgroundColor: Colors.background,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  author: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
});

export default RecommendationCard;
