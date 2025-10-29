import { Library } from '@/@types/auth.types';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type LibraryCardProps = {
  library: Library;
  onPress: () => void;
  onOptionsPress: () => void;
};

const LibraryCard = ({ library, onPress, onOptionsPress }: LibraryCardProps) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{library.name}</Text>
        {library.description && ( 
          <Text style={styles.description}>{library.description}</Text>
        )}
      </View>
      <TouchableOpacity style={styles.optionsButton} onPress={onOptionsPress}>
        <Ionicons name="ellipsis-vertical" size={24} color={Colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  optionsButton: {
    padding: 8,
  },
});

export default LibraryCard;