import { StyledButton } from "@/components/button";
import Input from "@/components/input";
import { Colors } from "@/constants/Colors";
import { FieldErrors, ValidationError } from "@/service/HandlerApiException";
import * as UserService from "@/service/UserService";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors | null>(null);

  async function handlerRegister() {
    try {
      await UserService.register({ email, username, password });
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.log("Erro: ", error);
      if (error instanceof ValidationError) {
        setErrors(error.fieldErrors);
      } else {
        setErrors({ general: error.message || "Não foi possível realizar o login." });
      }
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.main}>
        <Text style={styles.title}>Cadastre-se</Text>
        <Input placeholder="Usuário" value={username} onChangeText={setUsername} />
        {errors?.username && <Text style={styles.error}>{errors.username}</Text>}
        <Input placeholder="Email" value={email} onChangeText={setEmail} />
        {errors?.email && <Text style={styles.error}>{errors.email}</Text>}
        <Input placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        {errors?.password && <Text style={styles.error}>{errors.password}</Text>}

        {errors?.general && <Text style={styles.error}>{errors.general}</Text>}

        <StyledButton title="Cadastrar" onPress={handlerRegister}></StyledButton>

        <View style={styles.textContainer}>
          <Text style={styles.text}>Já tem uma conta? </Text>
          <Link href={"/(auth)/login"} style={styles.link}>
            Faça login
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    margin: 16,
    paddingHorizontal: 12,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.background,
  },

  title: {
    fontSize: 40,
    color: Colors.text,
    alignSelf: "center",
    fontWeight: "bold",
    padding: 16,
  },

  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
  },

  text: {
    fontSize: 15,
    marginRight: 5,
    color: Colors.text,
  },

  link: {
    fontSize: 15,
    color: Colors.accent,
  },

  error: {
    color: "#E74C3C",
    fontSize: 14,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
});
