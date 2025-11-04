import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";

function CustomDrawerContent(props: any) {
  const { role, signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList
        {...props}
        screenOptions={{
          drawerActiveTintColor: Colors.accent,
        }}
      />
      {role === "ADMIN" && (
        <DrawerItem
          label="Painel admin"
          labelStyle={{
            color: Colors.textSecondary,
          }}
          icon={({ size }) => <Ionicons name="shield-checkmark-outline" size={size} color={Colors.textSecondary} />}
          onPress={() => props.navigation.navigate("admin/index")}
        />
      )}

      <DrawerItem
        label="Sair"
        labelStyle={{
          color: Colors.textSecondary,
        }}
        icon={({ size }) => <Ionicons name="log-out-outline" size={size} color={Colors.textSecondary} />}
        onPress={() => signOut()}
      />
    </DrawerContentScrollView>
  );
}

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.text,
        headerTitleAlign: "center",
        drawerStyle: {
          backgroundColor: Colors.surface,
          width: 240,
        },
        drawerActiveTintColor: Colors.accent,
        drawerInactiveTintColor: Colors.textSecondary,
        drawerActiveBackgroundColor: "rgba(157, 90, 239, 0.1)",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="library"
        options={{
          drawerLabel: "Bibliotecas",
          title: "Bibliotecas",
          drawerIcon: ({ color, size }) => <Ionicons name="library-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="books"
        options={{
          drawerLabel: "Livros",
          title: "Sua biblioteca",
          drawerIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="notes"
        options={{
          drawerLabel: "Anotações",
          title: "Anotações",
          drawerIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="book-form"
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: true,
          title: "Adicionar Livro",
          // presentation: 'modal',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
        }}
      />
      <Drawer.Screen
        name="book-search"
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: true,
          title: "Buscar template",
          // presentation: 'modal',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
        }}
      />

      <Drawer.Screen
        name="admin"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Painel Admin",
        }}
      />
    </Drawer>
  );
}
