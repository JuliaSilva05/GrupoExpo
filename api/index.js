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

export async function addUsuario(usuario) {
  try {
    const response1 = await axios.get(urlUsuario, { headers });
    alert(response1.data)
    alert(usuario.email)

    
    //const response = await axios.post(urlUsuario, usuario, { headers: headersJson });
    //return { ...usuario, ...response.data };
  } catch (err) {
    console.error("Erro ao criar usuario:", err);
    return null;
  }
}

export async function getUsuario() {
  try {
    const response = await axios.get(urlUsuario, { headers });
    return response.data.results || [];
  } catch (err) {
    console.error("Erro ao buscar usuario!", err);
    return [];
  }
}


/*
import AsyncStorage from '@react-native-async-storage/async-storage';
import Parse from 'parse/react-native.js';
Parse.setAsyncStorage(AsyncStorage)
Parse.initialize("CbKjS13gKu6xDLXp0pMNjWrBl3RpvPazUvDKEzj2","lDVd6yFMJgcnosLzKv1del0SlGFtJ9b7mpRlhQNe")
Parse.serverURL = "https://parseapi.back4app.com/"

export const createUser = async function () {
  const newNomeUsuario = nomeUsuario;
  const newEmail = email;
  const newSenha = senha;
  let Usuario = new Parse.Object('Usuario');
  Usuario.set('nomeUsuario', newNomeUsuario)
  Usuario.set('email', newEmail)
  Usuario.set('senha', newSenha)
  try {
    await Usuario.save()
    alert("Feito!!")
    setNomeUsuario('')
    setEmail('')
    setSenha('')
      
    return true;
  } catch (error) {
    alert("Error!")
    Alert.alert("Error!")
    return false;
  }
}
*/