import TemplateDisplay from "@/components/templateDisplay";
import { Colors } from "@/constants/Colors";
import React, { useContext } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SuggestionContext } from "./_layout";

export default function SuggestionDetailsTab() {
  const { details, isLoading } = useContext(SuggestionContext);

  if (isLoading || !details) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TemplateDisplay template={details.updated} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
});
