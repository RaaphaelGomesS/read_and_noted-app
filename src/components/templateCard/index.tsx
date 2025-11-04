import { BookTemplate } from "@/@types/auth.types";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TemplateCardProps = {
  template: BookTemplate;
  onPress: () => void;
};

const TemplateCard = ({ template, onPress }: TemplateCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {template.title}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{template.status}</Text>
        </View>
      </View>
      <Text style={styles.subtitle} numberOfLines={1}>
        {template.author}
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
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});

export default TemplateCard;
