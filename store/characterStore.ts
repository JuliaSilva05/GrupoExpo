import { create } from 'zustand';
import { getPersonagens, addPersonagem, updatePersonagem, deletePersonagem } from '@/api';
import { getRacaDetalhes, getClasseDetalhes, getAntecedenteDetalhes } from '@/api/dndApi';

interface Character {
  objectId: string;
  nome: string;
  raca: string;
  classe: string;
  antecedente: string;
  background: string;
  usuarioId: string;
  createdAt: string;
  updatedAt: string;
  racaDetalhes?: any;
  classeDetalhes?: any;
  antecedenteDetalhes?: any;
}

interface CharacterState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  fetchCharacters: (userId: string) => Promise<void>;
  addCharacter: (character: Omit<Character, 'objectId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCharacter: (character: Character) => Promise<void>;
  deleteCharacter: (objectId: string) => Promise<void>;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: [],
  loading: false,
  error: null,

  fetchCharacters: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const personagens = await getPersonagens();
      const personagensDoUsuario = personagens.filter((p: Character) => p.usuarioId === userId);
      
      // Carregar detalhes para cada personagem
      const personagensComDetalhes = await Promise.all(
        personagensDoUsuario.map(async (personagem: Character) => {
          try {
            const [racaDetalhes, classeDetalhes, antecedenteDetalhes] = await Promise.all([
              personagem.raca ? getRacaDetalhes(personagem.raca) : null,
              personagem.classe ? getClasseDetalhes(personagem.classe) : null,
              personagem.antecedente ? getAntecedenteDetalhes(personagem.antecedente) : null
            ]);

            return {
              ...personagem,
              racaDetalhes,
              classeDetalhes,
              antecedenteDetalhes
            };
          } catch (error) {
            console.error(`Erro ao carregar detalhes do personagem ${personagem.objectId}:`, error);
            return personagem;
          }
        })
      );

      set({ characters: personagensComDetalhes, loading: false });
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
      set({ error: 'Erro ao buscar personagens', loading: false });
    }
  },

  addCharacter: async (character) => {
    set({ loading: true, error: null });
    try {
      const novoPersonagem = await addPersonagem(character);
      // Montar personagem completo: dados do formulário + retorno do backend
      const personagemCompleto = {
        ...character,
        ...novoPersonagem, // objectId, createdAt, updatedAt
      };
      // Carregar detalhes para o novo personagem
      const [racaDetalhes, classeDetalhes, antecedenteDetalhes] = await Promise.all([
        personagemCompleto.raca ? getRacaDetalhes(personagemCompleto.raca) : null,
        personagemCompleto.classe ? getClasseDetalhes(personagemCompleto.classe) : null,
        personagemCompleto.antecedente ? getAntecedenteDetalhes(personagemCompleto.antecedente) : null
      ]);
      const personagemComDetalhes = {
        ...personagemCompleto,
        racaDetalhes,
        classeDetalhes,
        antecedenteDetalhes
      };
      set(state => ({
        // Evitar duplicidade: filtra se já existe pelo objectId
        characters: [
          ...state.characters.filter(p => p.objectId !== personagemComDetalhes.objectId),
          personagemComDetalhes
        ],
        loading: false
      }));
    } catch (error) {
      console.error('Erro ao adicionar personagem:', error);
      set({ error: 'Erro ao adicionar personagem', loading: false });
    }
  },

  updateCharacter: async (character) => {
    set({ loading: true, error: null });
    try {
      const personagemOriginal = get().characters.find(p => p.objectId === character.objectId);
      const personagemAtualizado = await updatePersonagem(character);
      // Carregar detalhes para o personagem atualizado
      const [racaDetalhes, classeDetalhes, antecedenteDetalhes] = await Promise.all([
        character.raca ? getRacaDetalhes(character.raca) : null,
        character.classe ? getClasseDetalhes(character.classe) : null,
        character.antecedente ? getAntecedenteDetalhes(character.antecedente) : null
      ]);
      const personagemComDetalhes = {
        ...personagemOriginal,
        ...character,
        ...personagemAtualizado,
        racaDetalhes,
        classeDetalhes,
        antecedenteDetalhes
      };
      set(state => ({
        characters: state.characters.map(p => 
          p.objectId === personagemComDetalhes.objectId ? personagemComDetalhes : p
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Erro ao atualizar personagem:', error);
      set({ error: 'Erro ao atualizar personagem', loading: false });
    }
  },

  deleteCharacter: async (objectId: string) => {
    set({ loading: true, error: null });
    try {
      await deletePersonagem({ objectId });
      set(state => ({
        characters: state.characters.filter(p => p.objectId !== objectId),
        loading: false
      }));
    } catch (error) {
      console.error('Erro ao deletar personagem:', error);
      set({ error: 'Erro ao deletar personagem', loading: false });
      throw error; // Propagar o erro para ser tratado no componente
    }
  },
})); 