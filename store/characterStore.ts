import { create } from 'zustand';
import { getPersonagens } from '@/api/index';

interface Character {
  objectId: string;
  nome: string;
  raca: string;
  classe: string;
  antecedente: string;
  background: string;
  usuarioId: string;
  racaDetalhes?: any;
  classeDetalhes?: any;
  antecedenteDetalhes?: any;
}

interface CharacterState {
  characters: Character[];
  isLoading: boolean;
  error: string | null;
  fetchCharacters: (userId: string) => Promise<void>;
  addCharacter: (character: Character) => void;
  updateCharacter: (character: Character) => void;
  deleteCharacter: (objectId: string) => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: [],
  isLoading: false,
  error: null,

  fetchCharacters: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const dados = await getPersonagens();
      const userCharacters = dados.filter((p: Character) => p.usuarioId === userId);
      set({ characters: userCharacters, isLoading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar personagens', isLoading: false });
      console.error('Erro ao carregar personagens:', error);
    }
  },

  addCharacter: (character: Character) => {
    set((state) => ({
      characters: [...state.characters, character]
    }));
  },

  updateCharacter: (character: Character) => {
    set((state) => ({
      characters: state.characters.map((c) =>
        c.objectId === character.objectId ? character : c
      )
    }));
  },

  deleteCharacter: (objectId: string) => {
    set((state) => ({
      characters: state.characters.filter((c) => c.objectId !== objectId)
    }));
  }
})); 