import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";

function CustomDrawerContent(props: any) {
  const { signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList
        {...props}
        screenOptions={{
          drawerActiveTintColor: Colors.accent,
        }}
      />

      <DrawerItem
        label="Sair"
        labelStyle={{
          color: Colors.textSecondary,
        }}
        icon={({ size }) => <Ionicons name="log-out-outline" size={size} color={"#FF453A"} />}
        onPress={() => signOut()}
      />
    </DrawerContentScrollView>
  );
}

export default function AppLayout() {
  const { role } = useAuth();

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
        name="statistics/index"
        options={{
          drawerLabel: "Estatísticas",
          title: "Estatísticas",
          drawerIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} />,
          headerShown: true,
        }}
      />

      <Drawer.Screen
        name="profile/index"
        options={{
          drawerLabel: "Meu Perfil",
          title: "Meu Perfil",
          drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
          headerShown: true,
        }}
      />

      <Drawer.Screen
        name="admin"
        options={{
          drawerLabel: "Painel admin",
          title: "Painel do administrador",
          headerShown: true,
          drawerItemStyle: {
            display: role === "ADMIN" ? "flex" : "none",
          },
          drawerIcon: ({ color, size }) => <Ionicons name="shield-checkmark-outline" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}
