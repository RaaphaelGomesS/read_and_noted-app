import { SuggestionDetails } from "@/@types/suggestion.type";
import { StyledButton } from "@/components/button";
import Input from "@/components/input";
import { Colors } from "@/constants/Colors";
import * as AdminService from "@/service/AdminService";
import { Ionicons } from "@expo/vector-icons";
import { Stack, Tabs, useLocalSearchParams, useRouter } from "expo-router";
import React, { createContext, useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";

type SuggestionContextType = {
  details: SuggestionDetails | null;
  isLoading: boolean;
  isActionLoading: boolean;
  handleApprove: () => void;
  handleDecline: () => void;
  openDeclineModal: () => void;
};

export const SuggestionContext = createContext<SuggestionContextType>({
  details: null,
  isLoading: true,
  isActionLoading: false,
  handleApprove: () => {},
  handleDecline: () => {},
  openDeclineModal: () => {},
});

const DeclineModal = ({ visible, onClose, onSubmit, justification, setJustification, isLoading }: any) => (
  <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Recusar sugestão</Text>
        <Input
          placeholder="Justificativa da recusa..."
          value={justification}
          onChangeText={setJustification}
          multiline
          style={styles.textArea}
        />
        <View style={styles.buttonContainer}>
          <StyledButton
            title={isLoading ? "Enviando..." : "Enviar recusa"}
            onPress={onSubmit}
            style={[styles.flexButton, styles.declineButton]}
            disabled={isLoading}
          />
          <StyledButton
            title="Cancelar"
            variant="secondary"
            style={styles.flexButton}
            onPress={onClose}
            disabled={isLoading}
          />
        </View>
      </View>
    </View>
  </Modal>
);

export default function SuggestionDetailTabLayout() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const suggestionId = parseInt(id, 10);

  const [details, setDetails] = useState<SuggestionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
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
    if (!details) return;
    setIsActionLoading(true);
    try {
      await AdminService.approveSuggestion(suggestionId);
      Alert.alert("Sucesso", "Sugestão aprovada.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/admin/suggestions") },
      ]);
    } catch (error: any) {
      Alert.alert("Erro ao aprovar", error.message);
      setIsActionLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!details || !justification.trim()) {
      Alert.alert("Erro", "A justificativa é obrigatória para recusar.");
      return;
    }
    setIsActionLoading(true);
    try {
      await AdminService.declineSuggestion(suggestionId, justification);
      Alert.alert("Sucesso", "Sugestão recusada.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/admin/suggestions") },
      ]);
      setIsDeclineModalVisible(false);
    } catch (error: any) {
      Alert.alert("Erro ao recusar", error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const openDeclineModal = () => setIsDeclineModalVisible(true);

  const contextValue = {
    details,
    isLoading,
    isActionLoading,
    handleApprove,
    handleDecline,
    openDeclineModal,
  };

  return (
    <SuggestionContext.Provider value={contextValue}>
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Analisar sugestão" }} />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.accent,
            tabBarInactiveTintColor: Colors.textSecondary,
            tabBarStyle: {
              backgroundColor: Colors.surface,
              borderTopWidth: 0,
              paddingBottom: 24,
              height: 70,
            },
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: "500",
              paddingBottom: 5,
            },
            tabBarIconStyle: {
              marginTop: 5,
            },
          }}
        >
          <Tabs.Screen
            name="details"
            options={{
              title: "Sugestão",
              tabBarIcon: ({ color, size }) => <Ionicons name="bulb-outline" size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="original"
            options={{
              title: "Original",
              tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
            }}
          />
        </Tabs>

        <DeclineModal
          visible={isDeclineModalVisible}
          onClose={() => setIsDeclineModalVisible(false)}
          onSubmit={handleDecline}
          justification={justification}
          setJustification={setJustification}
          isLoading={isActionLoading}
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
  approveButton: {
    backgroundColor: "#2ECC71",
    flex: 1,
    marginTop: 0,
  },
  declineButton: {
    backgroundColor: "#E74C3C",
  },
  flexButton: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.card,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "47.7%",
    gap: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: Colors.background,
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
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 18,
    backgroundColor: Colors.card,
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 10,
    fontSize: 16,
  },
});
