import { Colors } from "@/constants/Colors";
import React from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity } from "react-native";

export type OptionItem = {
  label: string;
  value: string;
};

type SimpleSelectModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  options: OptionItem[];
  title?: string;
  currentValue?: string | null;
};

const SimpleSelectModal = ({ visible, onClose, onSelect, options, title, currentValue }: SimpleSelectModalProps) => {
  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
          {title && <Text style={styles.modalTitle}>{title}</Text>}

          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.optionButton} onPress={() => handleSelect(item.value)}>
                <Text style={[styles.optionText, item.value === currentValue && styles.optionTextSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            style={styles.list}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    maxHeight: "60%",
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 10,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.surface,
  },
  list: {
    maxHeight: 300,
  },
  optionButton: {
    paddingVertical: 18,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.surface,
  },
  optionText: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: Colors.accent,
    fontWeight: "bold",
  },
});

export default SimpleSelectModal;
