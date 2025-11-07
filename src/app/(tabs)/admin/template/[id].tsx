import { BookTemplate } from "@/@types/template.types";
import { StyledButton } from "@/components/button";
import TemplateDisplay from "@/components/templateDisplay";
import { Colors } from "@/constants/Colors";
import * as AdminService from "@/service/AdminService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";

export default function TemplateDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const templateId = parseInt(params.id, 10);

  const [template, setTemplate] = useState<BookTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (templateId) {
      AdminService.getTemplateDetails(templateId)
        .then(setTemplate)
        .catch((err) => Alert.alert("Erro", err.message, [{ text: "OK", onPress: () => router.back() }]))
        .finally(() => setIsLoading(false));
    }
  }, [templateId]);

  const handleAction = async (action: "approve" | "deactivate" | "edit") => {
    if (!template) return;
    setIsLoading(true);
    try {
      if (action === "approve") {
        await AdminService.approveTemplate(template.id);
        Alert.alert("Sucesso", "Template aprovado.", [{ text: "OK", onPress: () => router.back() }]);
      } else if (action === "deactivate") {
        await AdminService.deactivateTemplate(template.id);
        Alert.alert("Sucesso", "Template desativado.", [{ text: "OK", onPress: () => router.back() }]);
      } else if (action === "edit") {
        router.push({
          pathname: "/admin/template-form",
          params: { templateId: template.id },
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message);
      setIsLoading(false);
    }
  };

  if (isLoading || !template) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TemplateDisplay template={template} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <StyledButton title="Aprovar" onPress={() => handleAction("approve")} style={styles.approveButton} />
        <StyledButton title="Editar" onPress={() => handleAction("edit")} style={styles.editButton} />
        <StyledButton title="Desativar" onPress={() => handleAction("deactivate")} style={styles.deactivateButton} />
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
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.card,
    backgroundColor: Colors.background,
    gap: 10,
  },
  approveButton: {
    backgroundColor: "#2ECC71",
  },
  editButton: {
    backgroundColor: "#3498DB",
  },
  deactivateButton: {
    backgroundColor: Colors.textSecondary,
  },
});
