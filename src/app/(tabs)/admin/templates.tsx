import { BookTemplate } from "@/@types/template.types";
import TemplateCard from "@/components/templateCard";
import { Colors } from "@/constants/Colors";
import * as AdminService from "@/service/AdminService";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";

export default function TemplatesScreen() {
  const router = useRouter();
  const [templates, setTemplates] = useState<BookTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchData = async (pageToFetch: number) => {
    if (pageToFetch === 0) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const data = await AdminService.getTemplates("IN_ANALYZE", pageToFetch);
      setTemplates((prev) => (pageToFetch === 0 ? data.data : [...prev, ...data.data]));
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData(0);
    }, [])
  );

  const loadMore = () => {
    if (isFetchingMore || page >= totalPages - 1) return;
    fetchData(page + 1);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <FlatList
      data={templates}
      keyExtractor={(item) => item.id.toString()}
      style={styles.container}
      renderItem={({ item }) => (
        <TemplateCard template={item} onPress={() => router.push(`/admin/template/${item.id}`)} />
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>Nenhum template em análise.</Text>}
      onRefresh={() => fetchData(0)}
      refreshing={isLoading}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingMore ? <ActivityIndicator color={Colors.accent} style={{ margin: 10 }} /> : null}
      contentContainerStyle={templates.length === 0 ? styles.center : { paddingTop: 8 }}
    />
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
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
