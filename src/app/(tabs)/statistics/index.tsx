import { BookSummary, StatisticsData } from "@/@types/statistics.types";
import RecommendationCard from "@/components/recommendationCard";
import { Colors } from "@/constants/Colors";
import * as StatisticsService from "@/service/StatisticsService";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";

const StatCard = ({ label, value, unit }: { label: string; value: number; unit?: string }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <View style={styles.statValueRow}>
      <Text style={styles.statValue}>{value || 0}</Text>
      {unit && <Text style={styles.statUnit}> {unit}</Text>}
    </View>
  </View>
);

const StatusList = ({ data }: { data: StatisticsData["statusCounts"] }) => {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Livros separados por status</Text>
      {data.map((item) => (
        <View key={item.status} style={styles.row}>
          <Text style={styles.rowLabel}>{capitalize(item.status)}</Text>
          <Text style={styles.rowValue}>{item.count}</Text>
        </View>
      ))}
    </View>
  );
};

const CategoryList = ({ data }: { data: StatisticsData["finishedBooksByCategory"] }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Categorias mais lidas</Text>
    {data.map((item) => (
      <View key={item.categoryName} style={styles.row}>
        <Text style={styles.rowLabel}>{item.categoryName}</Text>
        <Text style={styles.rowValue}>{item.count}</Text>
      </View>
    ))}
  </View>
);

const RecommendationsList = ({ data }: { data: BookSummary[] }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Sugestões baseadas na última leitura finalizada</Text>
    {data.map((book) => (
      <RecommendationCard key={book.templateId} book={book} />
    ))}
  </View>
);

export default function StatisticsScreen() {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [recommendations, setRecommendations] = useState<BookSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsData, recommendationsData] = await Promise.all([
        StatisticsService.getStatistics(),
        StatisticsService.getRecommendations(),
      ]);
      setStats(statsData);
      setRecommendations(recommendationsData);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>Não foi possível carregar as estatísticas.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statCardContainer}>
        <StatCard label="Média de páginas lidas por dia" value={stats.averagePagesReadInDay} />
        <StatCard label="Média para finalizar uma obra" value={stats.averageReadingTimeInDays} unit="dias" />
      </View>

      <StatusList data={stats.statusCounts} />

      <CategoryList data={stats.finishedBooksByCategory} />

      {recommendations.length > 0 && <RecommendationsList data={recommendations} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 20,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },

  statCardContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 8,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  statValue: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: "bold",
  },
  statUnit: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginLeft: 4,
  },

  sectionContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  rowLabel: {
    color: Colors.text,
    fontSize: 16,
  },
  rowValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
