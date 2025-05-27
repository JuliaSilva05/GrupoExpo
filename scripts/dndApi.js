const BASE_URL = "https://www.dnd5eapi.co/api";

// Função para buscar todas as raças
export async function getRacas() {
  try {
    const response = await axios.get(`${BASE_URL}/races`);
    return response.data.results || [];
  } catch (err) {
    console.error("Erro ao buscar raças:", err);
    return [];
  }
}

// Função para buscar detalhes de uma raça específica
export async function getRacaDetalhes(index) {
  try {
    const response = await axios.get(`${BASE_URL}/races/${index}`);
    return response.data;
  } catch (err) {
    console.error(`Erro ao buscar detalhes da raça ${index}:`, err);
    return null;
  }
}