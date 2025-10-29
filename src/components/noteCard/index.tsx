import { NoteSummary } from '@/@types/auth.types';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type NoteCardProps = {
  note: NoteSummary;
  onPress: () => void;
};

const getCategoryColor = (categoryName: string) => {
  if (!categoryName) return Colors.accent;

  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 60%)`;
};

const NoteCard = ({ note, onPress }: NoteCardProps) => {
  const categoryColor = getCategoryColor(note.category);

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{note.title}</Text>
      </View>
      
      <View style={styles.footer}>
         <View style={[styles.tag, { backgroundColor: categoryColor }]}>
            <Text style={styles.tagText}>{note.category}</Text>
         </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tag: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: Colors.accent,
    alignSelf: 'flex-start',
  },
  tagText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default NoteCard;