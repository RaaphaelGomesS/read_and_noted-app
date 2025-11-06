import { StyledButton } from "@/components/button";
import Input from "@/components/input";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { FieldErrors, ValidationError } from "@/service/HandlerApiException";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { signIn } = useAuth();
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [errors, setErrors] = useState<FieldErrors | null>(null);

  async function handlerLogin() {
    setErrors(null);
    try {
      await signIn({ identifier, password });
    } catch (error: any) {
      console.log("Erro de login: ", error);
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
        <Text style={styles.title}>Logar</Text>
        <Input placeholder="Usuário ou email" value={identifier} onChangeText={setIdentifier} />
        {errors?.identifier && <Text style={styles.error}>{errors.identifier}</Text>}
        <Input placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
        {errors?.password && <Text style={styles.error}>{errors.password}</Text>}

        {errors?.general && <Text style={styles.error}>{errors.general}</Text>}

        <StyledButton title="Logar" onPress={handlerLogin}></StyledButton>

        <View style={styles.textContainer}>
          <Text style={styles.text}>Não tem uma conta? </Text>
          <Link href={"/(auth)/register"} style={styles.link}>
            Cadastre-se
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
