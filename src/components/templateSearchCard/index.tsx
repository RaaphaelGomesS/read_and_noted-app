import { BookTemplate } from "@/@types/template.types";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { StyledButton } from "../button";

type TemplateSearchCardProps = {
  template: BookTemplate;
  onSelect: () => void;
};

const TemplateSearchCard = ({ template, onSelect }: TemplateSearchCardProps) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: template.img || undefined }} style={styles.coverImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {template.title}
        </Text>
        <Text style={styles.author}>{template.author}</Text>
      </View>
      <StyledButton title="Selecionar" onPress={onSelect} style={styles.button} />
    </View>
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
    alignItems: "center",
  },
  coverImage: {
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    minWidth: "auto",
    marginTop: 0,
  },
});

export default TemplateSearchCard;
