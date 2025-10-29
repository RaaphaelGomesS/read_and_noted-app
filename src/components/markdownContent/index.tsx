import { NoteFull } from '@/@types/auth.types';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type MarkdownRendererProps = {
  content: string;
  linkedNotes: NoteFull['linkedNotes'];
};

const MarkdownRenderer = ({ content, linkedNotes }: MarkdownRendererProps) => {
  const router = useRouter();

  const linkMap = new Map<string, number>();
  linkedNotes.forEach(note => {
    linkMap.set(note.title.toLowerCase(), note.id);
  });

  const wikiLinkRegex = /\[\[(.*?)\]\]/g;

  const parts = content.split(wikiLinkRegex);

  const handleLinkPress = (title: string) => {
    const id = linkMap.get(title.toLowerCase());
    if (id) {
      router.push(`/notes/${id}`);
    } else {
      console.warn(`Nota "${title}" não encontrada. Criar?`);
      router.push({ pathname: '/notes/form', params: { title: title } });
    }
  };

  return (
    <Text style={styles.text}>
      {parts.map((part, index) => {
        const isLink = index % 2 === 1;

        if (isLink) {
          const id = linkMap.get(part.toLowerCase());
          return (
            <TouchableOpacity key={index} onPress={() => handleLinkPress(part)}>
              <Text style={id ? styles.link : styles.missingLink}>
                {part}
              </Text>
            </TouchableOpacity>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 26,
  },
  link: {
    color: Colors.accent,
    textDecorationLine: 'underline',
  },
  missingLink: {
      color: Colors.textSecondary,
      textDecorationLine: 'underline',
      textDecorationStyle: 'dotted',
  }
});

export default MarkdownRenderer;