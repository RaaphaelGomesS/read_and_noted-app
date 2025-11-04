import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';

function CustomDrawerContent(props: any) {
  const { role, signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {role === 'ADMIN' && (
        <DrawerItem
          label="Painel Admin"
          icon={({ color, size }) => (
            <Ionicons name="shield-checkmark-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('admin/index')}
        />
      )}
      
      <DrawerItem
        label="Sair"
        icon={({ color, size }) => (
          <Ionicons name="log-out-outline" size={size} color={color} />
        )}
        onPress={() => signOut()}
      />
    </DrawerContentScrollView>
  );
}

export default function AppLayout() {
  return (
    <Drawer drawerContent={(props: any) => <CustomDrawerContent {...props} />}
    screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.text,
        headerTitleAlign: 'center',
        drawerStyle: {
          backgroundColor: Colors.surface,
          width: 240,  
        },
        drawerActiveTintColor: Colors.accent,
        drawerInactiveTintColor: Colors.textSecondary,
        drawerActiveBackgroundColor: 'rgba(157, 90, 239, 0.1)',
      }}
    >

      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: 'none' }
        }}
      />

      <Drawer.Screen
        name="library"
        options={{
          drawerLabel: 'Bibliotecas',
          title: 'Bibliotecas',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="library-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="books/status"
        options={{
          drawerLabel: 'Livros',
           title: 'Sua biblioteca',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          )
        }}
      />
      
      <Drawer.Screen
        name="notes"
        options={{
          drawerLabel: 'Anotações',
          title: 'Anotações',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen 
        name="books/form"
        options={{ 
          drawerItemStyle: { display: 'none' },
          headerShown: true,
          title: "Adicionar Livro",
          // presentation: 'modal',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
        }} 
      />
      <Drawer.Screen 
        name="books/search" 
        options={{ 
          drawerItemStyle: { display: 'none' },
          headerShown: true,
          title: "Buscar Template",
          // presentation: 'modal',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
        }} 
      />
      
      <Drawer.Screen 
        name="admin" 
        options={{ 
          drawerItemStyle: { display: 'none' },
          title: 'Painel Admin',
        }} 
      />
    </Drawer>
  );
} 