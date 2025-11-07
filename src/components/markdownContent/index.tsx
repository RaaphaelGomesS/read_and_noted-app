import { NoteFull } from "@/@types/note.types";
import { Colors } from "@/constants/Colors";
import * as NoteService from "@/service/NoteService";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Platform, StyleSheet, Text } from "react-native";
import { RenderRules } from "react-native-markdown-display";

let _router: ReturnType<typeof useRouter> | null = null;
const getRouter = (): ReturnType<typeof useRouter> | null => _router;

const handleLinkPress = (title: string, linkMap: Map<string, number>) => {
  const id = linkMap.get(title.toLowerCase());
  const router = getRouter();
  if (!router) return;

  if (id) {
    router.push(`/notes/${id}`);
  } else {
    Alert.alert("Link Quebrado", `A nota "${title}" não existe. Deseja criá-la?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Criar",
        onPress: async () => {
          try {
            const newNote = await NoteService.createNote();
            await NoteService.updateNote({
              id: newNote.id,
              title: title,
              content: ""
            });
            router.push(`/notes/${newNote.id}`);
          } catch (e) {
            Alert.alert("Erro", "Não foi possível criar a nota.");
          }
        },
      },
    ]);
  }
};

export const initializeMarkdownRouter = (router: ReturnType<typeof useRouter>) => {
  _router = router;
};

export const getMarkdownRules = (linkedNotes: NoteFull["linkedNotes"]): RenderRules => {
  const linkMap = new Map<string, number>();
  linkedNotes.forEach((note) => {
    linkMap.set(note.title.toLowerCase(), note.id);
  });

  const WIKILINK_REGEX = /\[\[(.*?)\]\]/g;

  return {
    text: (node, children, parent, styles, onLinkPress) => {
      if (!node.content.match(WIKILINK_REGEX)) {
        return (
          <Text key={node.key} style={styles.text}>
            {node.content}
          </Text>
        );
      }
      const parts = node.content.split(WIKILINK_REGEX);
      return (
        <Text key={node.key} style={styles.text}>
          {parts.map((part, index) => {
            const isLink = index % 2 === 1;
            if (isLink) {
              const id = linkMap.get(part.toLowerCase());
              return (
                <Text
                  key={index}
                  style={id ? styles.wikilink : styles.missingLink}
                  onPress={() => handleLinkPress(part, linkMap)}
                >
                  {part}
                </Text>
              );
            }
            return part;
          })}
        </Text>
      );
    }
  };
};

export const getMarkdownStyles = () => {
  return StyleSheet.create({
    text: {
      color: Colors.text,
      fontSize: 17,
      lineHeight: 28,
    },
    strong: {
      fontWeight: 'bold',
      color: Colors.text,
    },
    em: {
      fontStyle: 'italic',
      color: Colors.text,
    },
    del: {
        textDecorationLine: 'line-through',
    },

    heading1: {
      fontSize: 32,
      fontWeight: 'bold',
      color: Colors.text,
      marginTop: 20,
      marginBottom: 10,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: Colors.card,
    },
    heading2: {
      fontSize: 26,
      fontWeight: '700',
      color: Colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
     heading3: {
      fontSize: 22,
      fontWeight: '600',
      color: Colors.text,
      marginTop: 12,
      marginBottom: 6,
    },

    bullet_list_icon: {
      color: Colors.textSecondary,
      fontSize: 18,
      lineHeight: 28,
      marginRight: 5,
    },
    list_item: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginVertical: 4,
    },

    link: {
      color: '#3498db',
      textDecorationLine: 'underline',
    },
    wikilink: { 
      color: Colors.accent,
      textDecorationLine: 'underline',
      backgroundColor: 'rgba(157, 90, 239, 0.1)',
    },
    missingLink: {
      color: Colors.textSecondary,
      textDecorationLine: 'underline',
      textDecorationStyle: 'dotted',
    },
    
    blockquote: {
      backgroundColor: Colors.card,
      paddingLeft: 10,
      marginLeft: 5,
      borderLeftWidth: 3,
      borderLeftColor: Colors.accent,
    },
    code_inline: {
      backgroundColor: Colors.card,
      color: '#EB5757',
      paddingVertical: 2,
      paddingHorizontal: 4,
      borderRadius: 4,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    code_block: {
      backgroundColor: Colors.card,
      color: Colors.text,
      padding: 10,
      borderRadius: 4,
      marginVertical: 10,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
  });
};
