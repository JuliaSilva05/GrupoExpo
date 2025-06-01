import axios from "axios";
const urlUsuario = "https://parseapi.back4app.com/classes/Usuario";

const headers = {
  "X-Parse-Application-Id": "CbKjS13gKu6xDLXp0pMNjWrBl3RpvPazUvDKEzj2",
  "X-Parse-REST-API-Key": "yLq11eEukS2ei1EELDkmNqOBQ5qXpIoyxsU8i83o",
};
const headersJson = {
  ...headers,
  "Content-Type": "application/json",
};

// Usuario
export async function addUsuario(usuario) {
  try {
    const response = await axios.post(urlUsuario, usuario, { headers: headersJson });
    return { ...usuario, ...response.data };
  } catch (err) {
    console.error("Erro ao criar usuario:", err);
    return null;
  }
}
export const idUsuario = ''
export function pegarId(id){
  idUsuario = id
  //return idUsuario
}

// Personagens
const urlPersonagem = "https://parseapi.back4app.com/classes/Personagem";

export async function getPersonagens() {
  try {
    const response = await axios.get(urlPersonagem, { headers });
    return response.data.results || [];
  } catch (err) {
    console.error("Erro ao buscar personagens:", err);
    return [];
  }
}

export async function addPersonagem(personagem) {
  try {
    const response = await axios.post(urlPersonagem, personagem, { headers: headersJson });
    return { ...personagem, ...response.data };
  } catch (err) {
    console.error("Erro ao criar personagem:", err);
    return null;
  }
}

export async function updatePersonagem(personagem) {
  try {
    const { objectId, ...dados } = personagem;
    const response = await axios.put(`${urlPersonagem}/${objectId}`, dados, { headers: headersJson });
    return response.data;
  } catch (err) {
    console.error("Erro ao atualizar personagem:", err);
    return null;
  }
}

export async function deletePersonagem(personagem) {
  try {
    const response = await axios.delete(`${urlPersonagem}/${personagem.objectId}`, { headers });
    return response.data;
  } catch (err) {
    console.error("Erro ao deletar personagem:", err);
    return null;
  }
}