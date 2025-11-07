import { Colors } from "@/constants/Colors";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

interface CustomInputProps extends TextInputProps {
  editable?: boolean;
}

export default function Input({ editable = true, ...props }: CustomInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, !editable && styles.disabledInput]}
        placeholderTextColor={Colors.textSecondary}
        editable={editable}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
    borderWidth: 1,
    borderColor: Colors.boder,
  },

  disabledInput: {
    backgroundColor: Colors.surface,
    color: Colors.textSecondary,
    borderColor: Colors.surface,
  },
});
