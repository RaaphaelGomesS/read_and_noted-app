import { Colors } from '@/constants/Colors';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

type OptionsModalProps = {
  visible: boolean;
  onClose: () => void;
  options: { label: string; onPress: () => void; isDestructive?: boolean }[];
};

const OptionsModal = ({ visible, onClose, options }: OptionsModalProps) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    index === options.length - 1 && styles.lastOptionButton
                  ]}
                  onPress={() => {
                    option.onPress();
                    onClose();
                  }}
                >
                  <Text style={[styles.optionText, option.isDestructive && styles.destructiveText]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
           <TouchableOpacity style={styles.cancelButtonArea} onPress={onClose}>
                <View style={styles.cancelButton}>
                     <Text style={styles.cancelText}>Cancelar</Text>
                </View>
           </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 14,
    overflow: 'hidden',
     marginBottom: 10,
  },
  optionButton: {
    paddingVertical: 18,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.surface,
  },
  lastOptionButton: {
      borderBottomWidth: 0,
  },
  optionText: {
    color: Colors.accent,
    fontSize: 18,
  },
  destructiveText: {
    color: '#FF453A',
  },
   cancelButtonArea: {
        width: '100%',
        marginTop: 8,
    },
   cancelButton: {
        backgroundColor: Colors.card,
        borderRadius: 14,
        paddingVertical: 18,
        alignItems: 'center',
    },
    cancelText: {
        color: Colors.accent,
        fontSize: 18,
        fontWeight: '600',
    },
});

export default OptionsModal;