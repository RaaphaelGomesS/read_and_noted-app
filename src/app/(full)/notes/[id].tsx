import { NoteFull, NoteRequest } from "@/@types/note.types";
import CategorySelectModal from "@/components/categorySelectModal";
import { getMarkdownRules, getMarkdownStyles, initializeMarkdownRouter } from "@/components/markdownContent";
import OptionsModal from "@/components/optionsModal";
import SimpleSelectModal, { OptionItem } from "@/components/simpleSelectModal";
import { Colors } from "@/constants/Colors";
import { useDebounce } from "@/hooks/useDebounce";
import * as NoteService from "@/service/NoteService";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MarkdownDisplay from "react-native-markdown-display";

const NOTE_TYPE_OPTIONS: OptionItem[] = [
  { label: "Rápida", value: "Rápida" },
  { label: "Referência", value: "Referência" },
  { label: "Permanente", value: "Permanente" },
];

export default function NoteDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const noteId = parseInt(params.id, 10);
  const [note, setNote] = useState<NoteFull | null>(null);
  const [initialNote, setInitialNote] = useState<NoteFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [isOptionsModalVisible, setOptionsModalVisible] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isTypeModalVisible, setTypeModalVisible] = useState(false);

  useEffect(() => {
    initializeMarkdownRouter(router, saveNote);
  }, [router, note]);

  const debouncedNote = useDebounce(note, 2000);

  useEffect(() => {
    if (!initialNote || !debouncedNote || JSON.stringify(initialNote) === JSON.stringify(debouncedNote)) {
      return;
    }

    saveNote(debouncedNote);
  }, [debouncedNote]);

  const fetchNote = async () => {
    if (!noteId) return;
    setIsLoading(true);
    try {
      const data = await NoteService.getNoteById(noteId);
      setNote(data);
      setInitialNote(data);

      if (data.title.startsWith("Sem Título")) {
        setIsEditingText(true);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a anotação.", [{ text: "OK", onPress: () => router.back() }]);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNote();
    }, [noteId])
  );

  const saveNote = async (dataToSave: NoteFull | null = note) => {
    if (!dataToSave) return;
    setIsSaving(true);
    try {
      const requestData: NoteRequest = {
        id: dataToSave.id,
        title: dataToSave.title,
        content: dataToSave.content,
        category: dataToSave.category || undefined,
        type: dataToSave.type || undefined,
        reference: dataToSave.bookReference || undefined,
      };

      await NoteService.updateNote(requestData);

      const updatedNote = await NoteService.getNoteById(dataToSave.id);

      setNote(updatedNote);
      setInitialNote(updatedNote);
    } catch (error: any) {
      Alert.alert("Erro ao salvar", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePropertyChange = (key: keyof NoteFull, value: any) => {
    setNote((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleToggleEditMode = () => {
    if (isEditingText && note) {
      saveNote(note);
    }
    setIsEditingText(!isEditingText);
  };

  const handleDelete = () => {
    Alert.alert("Confirmar exclusão", `Tem certeza que deseja excluir a anotação "${note?.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await NoteService.deleteNote(noteId);
            router.back();
          } catch (error: any) {
            Alert.alert("Erro ao excluir", error.message);
          }
        },
      },
    ]);
  };

  const topMenuOptions = [
    { label: isEditingText ? "Salvar e visualizar" : "Editar corpo", onPress: handleToggleEditMode },
    { label: "Excluir anotação", onPress: handleDelete, isDestructive: true },
  ];

  const getCategoryColor = (categoryName: string | null) => {
    if (!categoryName) return Colors.textSecondary;

    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 50%)`;
  };

  const getTypeColor = (type: NoteFull["type"]) => {
    switch (type) {
      case "Permanente":
        return "#E53935";
      case "Referência":
        return "#1E88E5";
      case "Rápida":
        return "#43A047";
      default:
        return Colors.textSecondary;
    }
  };

  if (isLoading || !note) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  const markdownRules = getMarkdownRules(note.linkedNotes);
  const markdownStyles = getMarkdownStyles();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {isSaving && <ActivityIndicator size="small" color={Colors.accent} style={{ marginRight: 15 }} />}
              <TouchableOpacity onPress={() => setOptionsModalVisible(true)} style={{ padding: 8 }}>
                <Ionicons name="ellipsis-horizontal" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
          ),
          headerTitle: "",
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.titleInput}
          value={note.title}
          onChangeText={(text) => handlePropertyChange("title", text)}
          placeholder="Sem Título"
          placeholderTextColor={Colors.textSecondary}
        />

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} style={styles.metaIcon} />
            <Text style={styles.metaLabel}>Data</Text>
            <Text style={styles.metaValue}>{note.createdDate.split(" ")[0]}</Text>
          </View>

          <TouchableOpacity style={styles.metaItem} onPress={() => setCategoryModalVisible(true)}>
            <Ionicons name="pricetag-outline" size={16} color={Colors.textSecondary} style={styles.metaIcon} />
            <Text style={styles.metaLabel}>Categoria</Text>
            {note.category ? (
              <View style={[styles.tag, { backgroundColor: getCategoryColor(note.category) }]}>
                <Text style={styles.tagText}>{note.category}</Text>
              </View>
            ) : (
              <Text style={styles.metaValueNone}>Nenhuma</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.metaItem} onPress={() => setTypeModalVisible(true)}>
            <Ionicons name="bookmark-outline" size={16} color={Colors.textSecondary} style={styles.metaIcon} />
            <Text style={styles.metaLabel}>Tipo</Text>
            <View style={[styles.tag, { backgroundColor: getTypeColor(note.type) }]}>
              <Text style={styles.tagText}>{note.type}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />
        <View style={styles.contentContainer}>
          {isEditingText ? (
            <TextInput
              style={styles.textInput}
              value={note.content}
              onChangeText={(text) => handlePropertyChange("content", text)}
              multiline
              autoFocus
              placeholder="Comece a escrever..."
              placeholderTextColor={Colors.textSecondary}
            />
          ) : (
            <MarkdownDisplay style={markdownStyles} rules={markdownRules}>
              {note.content}
            </MarkdownDisplay>
          )}
        </View>
      </ScrollView>

      <OptionsModal
        visible={isOptionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        options={topMenuOptions}
      />

      <CategorySelectModal
        visible={isCategoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        currentCategoryName={note.category}
        onSelect={(newCategoryName) => {
          handlePropertyChange("category", newCategoryName || null);
        }}
      />

      <SimpleSelectModal
        visible={isTypeModalVisible}
        onClose={() => setTypeModalVisible(false)}
        options={NOTE_TYPE_OPTIONS}
        title="Selecione o tipo da nota"
        currentValue={note.type}
        onSelect={(value) => {
          handlePropertyChange("type", value as NoteFull["type"]);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  metaContainer: {
    paddingHorizontal: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  metaIcon: {
    marginRight: 12,
    width: 20,
  },
  metaLabel: {
    color: Colors.textSecondary,
    fontSize: 15,
    width: 90,
  },
  metaValue: {
    color: Colors.text,
    fontSize: 15,
  },
  tag: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tagText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "500",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginVertical: 12,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    minHeight: 300,
  },
  textInput: {
    color: Colors.text,
    fontSize: 17,
    lineHeight: 28,
    minHeight: 300,
    textAlignVertical: "top",
  },
  metaValueNone: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontStyle: "italic",
  },
});
