import { Colors } from "@/constants/Colors";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { StyledButton } from "../button";

type ISBNScannerModalProps = {
  visible: boolean;
  onClose: () => void;
  onBarcodeScanned: (isbn: string) => void;
};

export default function ISBNScannerModal({ visible, onClose, onBarcodeScanned }: ISBNScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (scanned) return;

    const { data: isbn, type } = scanningResult;
    console.log(`Scanned type: ${type}, data: ${isbn}`);

    if (type === "ean13" || type === "ean8") {
      setScanned(true);
      onBarcodeScanned(isbn);
      onClose();
    }
  };

  const handleClose = () => {
    setScanned(false);
    onClose();
  };

  let content = <View />;

  if (!permission) {
    content = <ActivityIndicator color={Colors.white} size="large" />;
  } else if (!permission.granted) {
    content = (
      <View style={styles.permissionContainer}>
        <Text style={styles.text}>Precisamos de acesso à sua câmera para escanear o ISBN.</Text>
        <StyledButton title="Permitir Acesso" onPress={requestPermission} style={{ marginTop: 20 }} />
      </View>
    );
  } else {
    content = (
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
    );
  }

  return (
    <Modal transparent={true} animationType="slide" visible={visible} onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.cameraContainer}>{content}</View>
        <View style={styles.overlay}>
          <Text style={styles.title}>Escanear ISBN</Text>
          <View style={styles.scanBox} />
          <StyledButton title="Cancelar" variant="secondary" onPress={handleClose} style={styles.button} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContainer: {
    padding: 20,
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.white,
    position: "absolute",
    top: 80,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  scanBox: {
    width: "80%",
    height: 150,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 12,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    position: "absolute",
    bottom: 60,
  },
});
