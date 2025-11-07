import { Suggestion } from "@/@types/suggestion.type";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SuggestionCardProps = {
  suggestion: Suggestion;
  onPress: () => void;
};

const SuggestionCard = ({ suggestion, onPress }: SuggestionCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {suggestion.title}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{suggestion.status}</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>Sugerido por: @{suggestion.suggesterUsername || "..."}</Text>
      <Text style={styles.reason} numberOfLines={2}>
        Motivo: {suggestion.reason}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    backgroundColor: Colors.accent,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  statusText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "bold",
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  reason: {
    color: Colors.text,
    fontSize: 14,
  },
});

export default SuggestionCard;
