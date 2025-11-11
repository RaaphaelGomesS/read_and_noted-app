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

const StarDisplay = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let iconName: "star" | "star-half" | "star-outline" = "star-outline";
    if (rating >= i) {
      iconName = "star";
    } else if (rating >= i - 0.5) {
      iconName = "star-half";
    }
    stars.push(<Ionicons name={iconName} size={18} color={Colors.accent} key={i} />);
  }
  return <View style={styles.starContainer}>{stars}</View>;
};

const ReadingDuration = ({ startDate, finishDate }: { startDate: string; finishDate: string }) => {
  try {
    const start = new Date(startDate).getTime();
    const finish = new Date(finishDate).getTime();

    if (isNaN(start) || isNaN(finish)) return null;

    const diffMs = finish - start;
    if (diffMs < 0) return null;

    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    const displayDays = Math.max(1, diffDays);
    const dayText = displayDays === 1 ? "dia" : "dias";

    return (
      <View style={styles.durationContainer}>
        <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
        <Text style={styles.durationText}>{`${displayDays} ${dayText}`}</Text>
      </View>
    );
  } catch (e) {
    console.error("Erro ao calcular data:", e);
    return null;
  }
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

        {status === "finalizado" && book.rating != null && book.rating > 0 && <StarDisplay rating={book.rating} />}
        {book.startedDate && book.finishedDate && (
          <ReadingDuration startDate={book.startedDate} finishDate={book.finishedDate} />
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
  finishedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 16,
  },
  starContainer: {
    flexDirection: "row",
  },
  durationContainer: {
    paddingTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default BookCard;
