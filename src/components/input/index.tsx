import { Colors } from "@/constants/Colors";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

export default function Input({ ...props }: TextInputProps) {
  return (
    <View style={styles.container}>
      <TextInput style={styles.input}
       placeholderTextColor={Colors.textSecondary}
        {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
container: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    width: "100%",
    backgroundColor: Colors.card,
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 10,
    fontSize: 16,
    borderColor: Colors.accent
  },
});
