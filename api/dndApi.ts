import axios from 'axios';

const BASE_URL = 'https://www.dnd5eapi.co/api';

// Get all races
export const getRacas = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/races`);
    return response.data.results;
  } catch (error) {
    console.error('Error getting races:', error);
    throw error;
  }
};

// Get race details
export const getRacaDetalhes = async (index: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/races/${index}`);
    return response.data;
  } catch (error) {
    console.error('Error getting race details:', error);
    throw error;
  }
};

// Get all classes
export const getClasses = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/classes`);
    return response.data.results;
  } catch (error) {
    console.error('Error getting classes:', error);
    throw error;
  }
};

// Get class details
export const getClasseDetalhes = async (index: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/classes/${index}`);
    return response.data;
  } catch (error) {
    console.error('Error getting class details:', error);
    throw error;
  }
};

// Get all backgrounds
export const getAntecedentes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/backgrounds`);
    return response.data.results;
  } catch (error) {
    console.error('Error getting backgrounds:', error);
    throw error;
  }
};

// Get background details
export const getAntecedenteDetalhes = async (index: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/backgrounds/${index}`);
    return response.data;
  } catch (error) {
    console.error('Error getting background details:', error);
    throw error;
  }
}; 