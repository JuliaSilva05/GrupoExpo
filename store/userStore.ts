import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  id: string;
  nomeUsuario: string;
  email: string;
  isLoggedIn: boolean;
  setUser: (id: string, nomeUsuario: string, email: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: '',
  nomeUsuario: '',
  email: '',
  isLoggedIn: false,
  setUser: async (id, nomeUsuario, email) => {
    console.log('Setting user:', { id, nomeUsuario, email });
    try {
      await AsyncStorage.setItem('user', JSON.stringify({ id, nomeUsuario, email }));
      set({ id, nomeUsuario, email, isLoggedIn: true });
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  },
  clearUser: async () => {
    try {
      await AsyncStorage.removeItem('user');
      set({ id: '', nomeUsuario: '', email: '', isLoggedIn: false });
    } catch (error) {
      console.error('Error clearing user from storage:', error);
    }
  },
}));

// Load user data from storage on app start
AsyncStorage.getItem('user').then((userData) => {
  if (userData) {
    const user = JSON.parse(userData);
    console.log('Loading user from storage:', user);
    useUserStore.getState().setUser(user.id, user.nomeUsuario, user.email);
  }
}); 