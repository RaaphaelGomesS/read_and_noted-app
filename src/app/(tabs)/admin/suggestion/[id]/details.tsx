import { StyledButton } from "@/components/button";
import TemplateDisplay from "@/components/templateDisplay";
import { Colors } from "@/constants/Colors";
import React, { useContext } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SuggestionContext } from "./_layout";

export default function SuggestionDetailsTab() {
  const { details, isLoading, isActionLoading, handleApprove, openDeclineModal } = useContext(SuggestionContext);

  if (isLoading || !details) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.reasonBox}>
          <Text style={styles.reasonTitle}>Motivo (por {details.updated.username}):</Text>
          <Text style={styles.reasonText}>{details.updated.reason}</Text>
        </View>

        <TemplateDisplay template={details.updated} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <StyledButton
          title={isActionLoading ? "..." : "Aprovar"}
          onPress={handleApprove}
          style={styles.approveButton}
          disabled={isActionLoading}
        />
        <StyledButton
          title={isActionLoading ? "..." : "Recusar"}
          onPress={openDeclineModal}
          style={styles.declineButton}
          disabled={isActionLoading}
        />
      </View>
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
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  reasonBox: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  reasonTitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  reasonText: {
    color: Colors.text,
    fontSize: 16,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.card,
    backgroundColor: Colors.background,
    flexDirection: "row",
    gap: 10,
  },
  approveButton: {
    backgroundColor: "#2ECC71",
    flex: 1,
    marginTop: 0,
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  declineButton: {
    backgroundColor: "#E74C3C",
    flex: 1,
    marginTop: 0,
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
