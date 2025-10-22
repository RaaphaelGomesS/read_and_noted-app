import { StyledButton } from "@/components/button";
import Input from "@/components/input";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.main}>
        <Text style={styles.title}>Logar</Text>
        <Input placeholder="Usuário ou email" />
        <Input placeholder="Senha" secureTextEntry />

        <StyledButton title="Logar"></StyledButton>

        <View style={styles.textContainer}>
          <Text style={styles.text}>Não tem uma conta? </Text>
          <Link href={"/(auth)/register"} style={styles.link}>Cadastre-se</Link>
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
    color: Colors.accent
  },
});
