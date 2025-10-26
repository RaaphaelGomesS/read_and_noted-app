import { StyledButton } from "@/components/button";
import Input from "@/components/input";
import { Colors } from "@/constants/Colors";
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

  async function handlerRegister() {
    try {
      await UserService.register({ email, username, password });
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.log("Erro: ", error);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.main}>
        <Text style={styles.title}>Cadastre-se</Text>
        <Input placeholder="Usuário" value={username} onChangeText={setUsername} />
        <Input placeholder="Email" value={email} onChangeText={setEmail} />
        <Input placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />

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
    backgroundColor: Colors.surface,
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
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 15
  },
});
