import { EditionResult } from "@/@types/externalBook.types";
import { Colors } from "@/constants/Colors";
import * as ExternalBookService from "@/service/ExternalBookService";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const EditionCard = ({ edition, onSelect }: { edition: EditionResult; onSelect: () => void }) => {
  const img = edition.cover_i ? `https://covers.openlibrary.org/b/id/${edition.cover_i}-M.jpg` : undefined;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onSelect}>
      <Image source={{ uri: img }} style={styles.coverImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {edition.title}
        </Text>
        <Text style={styles.detailText}>Ano: {edition.publish_date || "N/A"}</Text>
        <Text style={styles.detailText} numberOfLines={1}>
          Editora: {edition.publishers?.join(", ") || "N/A"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
};

export default function EditionSelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    workKey: string;
    libraryId: string;
  }>();

  const [editions, setEditions] = useState<EditionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (!params.workKey) {
      Alert.alert("Erro", "Informações da obra não encontradas.", [{ text: "OK", onPress: () => router.back() }]);
      return;
    }

    setIsLoading(true);
    ExternalBookService.getEditionsForWork(params.workKey)
      .then(setEditions)
      .catch((err) => {
        Alert.alert("Erro", err.message, [{ text: "OK", onPress: () => router.back() }]);
      })
      .finally(() => setIsLoading(false));
  }, [params.workKey]);

  const handleSelectEdition = async (editionKey: string) => {
    setIsSelecting(true);
    try {
      const richBookData = await ExternalBookService.getBookDetailsFromEditionKey(editionKey);

      router.replace({
        pathname: "/(full)/book-form",
        params: {
          libraryId: params.libraryId,
          externalBook: JSON.stringify(richBookData),
        },
      });
    } catch (error: any) {
      Alert.alert("Erro ao selecionar edição", error.message);
      setIsSelecting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Selecione uma edição" }} />

      {isSelecting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      )}

      <FlatList
        data={editions}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => <EditionCard edition={item} onSelect={() => handleSelectEdition(item.key)} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma edição foi encontrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
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
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
