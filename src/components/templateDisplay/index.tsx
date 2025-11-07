import { Suggestion } from "@/@types/suggestion.type";
import { BookTemplate } from "@/@types/template.types";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type TemplateDisplayProps = {
  template: BookTemplate | Suggestion;
};

const InfoRow = ({ label, value }: { label: string; value: string | null | number }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value || "N/A"}</Text>
  </View>
);

const TemplateDisplay = ({ template }: TemplateDisplayProps) => {
  return (
    <View style={styles.templateContainer}>
      <View style={styles.header}>
        <Image source={{ uri: template.img || undefined }} style={styles.coverImage} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{template.title}</Text>
          <Text style={styles.author}>{template.author}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <InfoRow label="ISBN" value={template.isbn} />
        <InfoRow label="Editora" value={template.publisher} />
        <InfoRow label="Ano" value={template.year} />
        <InfoRow label="Páginas" value={template.pages} />
        <InfoRow label="Categorias" value={Array.isArray(template.categories) ? template.categories.join(", ") : ""} />
        <Text style={styles.description}>{template.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  templateContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  coverImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  author: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  detailsContainer: {
    /* Vazio por enquanto, InfoRow cuida de si */
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "bold",
    width: 100,
  },
  infoValue: {
    color: Colors.text,
    fontSize: 16,
    flex: 1,
  },
  description: {
    color: Colors.text,
    fontSize: 16,
    marginTop: 10,
    lineHeight: 22,
  },
});

export default TemplateDisplay;
