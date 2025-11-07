import { SuggestionDetails } from "@/@types/suggestion.type";
import { StyledButton } from "@/components/button";
import Input from "@/components/input";
import { Colors } from "@/constants/Colors";
import * as AdminService from "@/service/AdminService";
import { Tabs, useGlobalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, View } from "react-native";

type SuggestionContextType = {
  details: SuggestionDetails | null;
  isLoading: boolean;
};
export const SuggestionContext = React.createContext<SuggestionContextType>({ details: null, isLoading: true });

const DeclineModal = ({ visible, onClose, onSubmit, justification, setJustification, isLoading }: any) => (
  <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Recusar Sugestão</Text>
        <Input
          placeholder="Justificativa da recusa..."
          value={justification}
          onChangeText={setJustification}
          multiline
          style={{ height: 100, textAlignVertical: "top", paddingTop: 16 }}
        />
        <StyledButton
          title={isLoading ? "Enviando..." : "Enviar Recusa"}
          onPress={onSubmit}
          style={styles.declineButton}
          disabled={isLoading}
        />
        <StyledButton title="Cancelar" variant="secondary" onPress={onClose} disabled={isLoading} />
      </View>
    </View>
  </Modal>
);

export default function SuggestionDetailLayout() {
  const router = useRouter();
  const { id } = useGlobalSearchParams<{ id: string }>();
  const suggestionId = parseInt(id, 10);

  const [details, setDetails] = useState<SuggestionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeclineModalVisible, setIsDeclineModalVisible] = useState(false);
  const [justification, setJustification] = useState("");

  useEffect(() => {
    if (suggestionId) {
      setIsLoading(true);
      AdminService.getSuggestionDetails(suggestionId)
        .then(setDetails)
        .catch((err) => Alert.alert("Erro", err.message, [{ text: "OK", onPress: () => router.back() }]))
        .finally(() => setIsLoading(false));
    }
  }, [suggestionId]);

  const handleApprove = async () => {
    // ... (lógica de aprovação)
  };
  const handleDecline = async () => {
    // ... (lógica de recusa)
  };

  if (isLoading || !details) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <SuggestionContext.Provider value={{ details, isLoading }}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.reasonBox}>
            <Text style={styles.reasonTitle}>Motivo da sugestão:</Text>
            <Text style={styles.reasonText}>{details.updated.reason}</Text>
          </View>

          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: Colors.accent,
              tabBarInactiveTintColor: Colors.textSecondary,
              tabBarStyle: {
                backgroundColor: Colors.card,
                borderRadius: 10,
                overflow: "hidden",
                marginBottom: 16,
              },
              tabBarLabelStyle: {
                fontSize: 15,
                fontWeight: "500",
                textTransform: "none",
              },
            }}
          >
            <Tabs.Screen name="details" options={{ title: "Sugestão" }} />
            <Tabs.Screen name="original" options={{ title: "Template original" }} />
          </Tabs>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <StyledButton title="Aprovar" onPress={handleApprove} style={styles.approveButton} />
          <StyledButton title="Recusar" onPress={() => setIsDeclineModalVisible(true)} style={styles.declineButton} />
        </View>

        <DeclineModal
          visible={isDeclineModalVisible}
          onClose={() => setIsDeclineModalVisible(false)}
          onSubmit={handleDecline}
          justification={justification}
          setJustification={setJustification}
          isLoading={isLoading}
        />
      </View>
    </SuggestionContext.Provider>
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
  },
  declineButton: {
    backgroundColor: "#E74C3C",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: Colors.card,
    borderRadius: 15,
    padding: 24,
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
});
