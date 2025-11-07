import { PasswordChangeRequest, UserResponseDTO, UserUpdateDTO } from "@/@types/auth.types";
import { StyledButton } from "@/components/button";
import Input from "@/components/input";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { FieldErrors, ValidationError } from "@/service/HandlerApiException";
import * as UserService from "@/service/UserService";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";

type ViewMode = "VIEW" | "EDIT_PROFILE" | "CHANGE_PASSWORD";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  const [viewMode, setViewMode] = useState<ViewMode>("VIEW");
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors | null>(null);

  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchUser = async () => {
    setIsFetching(true);
    try {
      const userData = await UserService.getUser();
      setUser(userData);
      setUsername(userData.username);
      setEmail(userData.email);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar seus dados.");
    } finally {
      setIsFetching(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const handleBack = () => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors(null);
    setViewMode("VIEW");
  };

  const handleSaveProfile = async () => {
    setErrors(null);
    setIsLoading(true);

    const requestData: UserUpdateDTO = { username, email };

    try {
      const updatedUser = await UserService.updateUser(requestData);
      setUser(updatedUser);
      setViewMode("VIEW");
      Alert.alert("Sucesso", "Perfil atualizado.");
    } catch (error: any) {
      if (error instanceof ValidationError) {
        setErrors(error.fieldErrors);
      } else {
        setErrors({ general: error.message || "Não foi possível atualizar." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async () => {
    setErrors(null);

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "A nova senha e a confirmação não conferem." });
      return;
    }

    setIsLoading(true);
    const requestData: PasswordChangeRequest = { currentPassword, newPassword };

    try {
      await UserService.changePassword(requestData);

      Alert.alert("Sucesso", "Senha alterada.");
      handleBack();
    } catch (error: any) {
      if (error instanceof ValidationError) {
        setErrors(error.fieldErrors);
      } else {
        setErrors({ general: error.message || "Não foi possível alterar a senha." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!user) return;
    Alert.alert("Confirmar exclusão", "Tem certeza que deseja excluir sua conta? Esta ação é irreversível.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          try {
            await UserService.deleteUser(user.id);
            await signOut();
            router.replace("/(auth)/login");
          } catch (error: any) {
            Alert.alert("Erro ao excluir", error.message);
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  if (isFetching) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  const isEditingProfile = viewMode === "EDIT_PROFILE";
  const isChangingPassword = viewMode === "CHANGE_PASSWORD";
  const isViewing = viewMode === "VIEW";

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Meu perfil" }} />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Input placeholder="Usuário" value={username} onChangeText={setUsername} editable={isEditingProfile} />
        {errors?.username && <Text style={styles.error}>{errors.username}</Text>}

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          editable={isEditingProfile}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors?.email && <Text style={styles.error}>{errors.email}</Text>}

        {isChangingPassword && (
          <>
            <View style={styles.divider} />
            <Text style={styles.label}>Trocar Senha</Text>
            <Input
              placeholder="Senha atual"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
            {errors?.currentPassword && <Text style={styles.error}>{errors.currentPassword}</Text>}
            <Input placeholder="Nova senha" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
            {errors?.newPassword && <Text style={styles.error}>{errors.newPassword}</Text>}
            <Input
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            {errors?.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
          </>
        )}

        {errors?.general && <Text style={[styles.error, styles.generalError]}>{errors.general}</Text>}

        <View style={styles.buttonContainer}>
          {isViewing && (
            <>
              <StyledButton title="Trocar senha" variant="secondary" onPress={() => setViewMode("CHANGE_PASSWORD")} />
              <StyledButton title="Editar perfil" onPress={() => setViewMode("EDIT_PROFILE")} />
              <StyledButton
                title="Deletar conta"
                variant="secondary"
                onPress={handleDelete}
                style={styles.deleteButton}
              />
            </>
          )}

          {!isViewing && (
            <>
              <StyledButton
                title="Voltar"
                variant="secondary"
                onPress={handleBack}
                disabled={isLoading}
                style={styles.buttonFlex}
              />
              <StyledButton
                title={isLoading ? "Salvando..." : "Salvar"}
                onPress={isEditingProfile ? handleSaveProfile : handleSavePassword}
                disabled={isLoading}
                style={styles.buttonFlex}
              />
            </>
          )}
        </View>
      </ScrollView>
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
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 32,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 10,
  },
  buttonFlex: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: Colors.card,
    borderColor: "#FF453A",
    borderWidth: 1,
  },
  deleteButtonText: {
    color: "#FF453A",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.card,
    marginVertical: 16,
  },
  label: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  error: {
    color: "#E74C3C",
    fontSize: 14,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  generalError: {
    textAlign: "center",
    marginTop: 8,
  },
});
