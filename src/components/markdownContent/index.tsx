import { NoteFull } from "@/@types/note.types";
import { Colors } from "@/constants/Colors";
import * as NoteService from "@/service/NoteService";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Platform, StyleSheet, Text } from "react-native";
import { RenderRules } from "react-native-markdown-display";

let _router: ReturnType<typeof useRouter> | null = null;
let _saveNote: (() => Promise<void>) | null = null;
const getRouter = (): ReturnType<typeof useRouter> | null => _router;

const handleLinkPress = async (title: string, linkMap: Map<string, number>) => {
  const id = linkMap.get(title.toLowerCase());
  const router = getRouter();
  if (!router) return;

  if (_saveNote) {
    await _saveNote();
  }

  if (id) {
    router.push(`/notes/${id}`);
  } else {
    Alert.alert("Link inexistente", `A nota "${title}" não existe. Deseja criá-la?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Criar",
        onPress: async () => {
          try {
            const newNote = await NoteService.createNote();
            await NoteService.updateNote({
              id: newNote.id,
              title: title,
              type: "Rápida",
              content: "",
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

export const initializeMarkdownRouter = (router: ReturnType<typeof useRouter>, saveNoteFn: () => Promise<void>) => {
  _router = router;
  _saveNote = saveNoteFn;
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
    },
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
      fontWeight: "bold",
      color: Colors.text,
    },
    em: {
      fontStyle: "italic",
      color: Colors.text,
    },
    del: {
      textDecorationLine: "line-through",
      color: Colors.textSecondary,
    },
    heading1: {
      fontSize: 32,
      fontWeight: "bold",
      color: Colors.text,
      marginTop: 24,
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomColor: Colors.boder,
    },
    heading2: {
      fontSize: 26,
      fontWeight: "700",
      color: Colors.text,
      marginTop: 20,
      marginBottom: 12,
      paddingBottom: 8,
      borderBottomColor: Colors.boder,
    },
    heading3: {
      fontSize: 22,
      fontWeight: "600",
      color: Colors.text,
      marginTop: 16,
      marginBottom: 8,
    },

    bullet_list_icon: {
      color: Colors.textSecondary,
      fontSize: 18,
      lineHeight: 28,
      marginRight: 8,
    },
    list_item: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginVertical: 5,
    },
    ordered_list_icon: {
      color: Colors.textSecondary,
      fontSize: 17,
      lineHeight: 28,
      marginRight: 8,
      fontWeight: "bold",
    },
    link: {
      color: "#3498db",
      textDecorationLine: "underline",
    },
    wikilink: {
      color: Colors.accent,
      fontWeight: "500",
      textDecorationLine: "none",
      backgroundColor: "rgba(157, 90, 239, 0.1)",
      paddingHorizontal: 2,
      borderRadius: 4,
    },
    missingLink: {
      color: Colors.textSecondary,
      textDecorationLine: "none",
      borderBottomWidth: 1,
      borderBottomColor: Colors.textSecondary,
      borderStyle: "dotted",
    },
    blockquote: {
      backgroundColor: Colors.card,
      paddingLeft: 12,
      marginLeft: 5,
      borderLeftWidth: 4,
      borderLeftColor: Colors.accent,
      marginVertical: 10,
    },
    code_inline: {
      backgroundColor: Colors.card,
      color: "#EB5757",
      paddingVertical: 2,
      paddingHorizontal: 4,
      borderRadius: 4,
      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
      fontSize: 15,
    },
    code_block: {
      backgroundColor: Colors.card,
      color: Colors.text,
      padding: 16,
      borderRadius: 8,
      marginVertical: 10,
      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    },
    hr: {
      backgroundColor: Colors.boder,
      height: 2,
      marginVertical: 20,
    },
  });
};
