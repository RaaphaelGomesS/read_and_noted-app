import { StyleSheet, Text, View } from "react-native";

export default function Index() {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Tela base</Text>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center"
    },

    title: {
        fontSize: 30,
        alignSelf: "center",
        fontWeight: "bold"
    }
});