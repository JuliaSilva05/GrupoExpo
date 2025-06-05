import axios from 'axios';

const BASE_URL = 'https://parseapi.back4app.com/classes';
const headers = {
  'X-Parse-Application-Id': 'CbKjS13gKu6xDLXp0pMNjWrBl3RpvPazUvDKEzj2',
  'X-Parse-REST-API-Key': 'yLq11eEukS2ei1EELDkmNqOBQ5qXpIoyxsU8i83o',
  'Content-Type': 'application/json',
};

// User Management
export const addUsuario = async (usuario: { nomeUsuario: string; email: string; senha: string }) => {
  try {
    console.log('Criando usuário:', usuario);
    const response = await axios.post(`${BASE_URL}/Usuario`, usuario, { headers });
    console.log('Usuário criado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Character Management
export const getPersonagens = async () => {
  try {
    console.log('Buscando todos os personagens...');
    const response = await axios.get(`${BASE_URL}/Personagem`, { headers });
    console.log('Personagens encontrados:', response.data.results);
    return response.data.results;
  } catch (error) {
    console.error('Error getting characters:', error);
    throw error;
  }
};

export const addPersonagem = async (personagem: any) => {
  try {
    if (!personagem.usuarioId) {
      console.error('Tentativa de criar personagem sem usuarioId');
      throw new Error('usuarioId é obrigatório para criar um personagem');
    }

    // Remover campos que podem causar problemas
    const personagemParaSalvar = {
      nome: personagem.nome,
      raca: personagem.raca,
      classe: personagem.classe,
      antecedente: personagem.antecedente,
      background: personagem.background,
      usuarioId: personagem.usuarioId,
    };

    console.log('Criando personagem:', personagemParaSalvar);
    const response = await axios.post(`${BASE_URL}/Personagem`, personagemParaSalvar, { headers });
    console.log('Personagem criado com sucesso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error adding character:', error.response?.data || error.message);
    throw error;
  }
};

export const updatePersonagem = async (personagem: any) => {
  try {
    if (!personagem.usuarioId) {
      console.error('Tentativa de atualizar personagem sem usuarioId');
      throw new Error('usuarioId é obrigatório para atualizar um personagem');
    }

    const { objectId, ...data } = personagem;
    // Remover campos que podem causar problemas
    const personagemParaAtualizar = {
      nome: data.nome,
      raca: data.raca,
      classe: data.classe,
      antecedente: data.antecedente,
      background: data.background,
      usuarioId: data.usuarioId,
    };

    console.log('Atualizando personagem:', { objectId, ...personagemParaAtualizar });
    const response = await axios.put(`${BASE_URL}/Personagem/${objectId}`, personagemParaAtualizar, { headers });
    console.log('Personagem atualizado com sucesso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating character:', error.response?.data || error.message);
    throw error;
  }
};

export const deletePersonagem = async ({ objectId }: { objectId: string }) => {
  try {
    console.log('Deletando personagem:', objectId);
    const response = await axios.delete(`${BASE_URL}/Personagem/${objectId}`, { headers });
    console.log('Personagem deletado com sucesso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting character:', error.response?.data || error.message);
    throw error;
  }
}; 