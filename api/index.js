import AsyncStorage from '@react-native-async-storage/async-storage';
import Parse from 'parse/react-native.js';
Parse.setAsyncStorage(AsyncStorage)
Parse.initialize('CbKjS13gKu6xDLXp0pMNjWrBl3RpvPazUvDKEzj2','lDVd6yFMJgcnosLzKv1del0SlGFtJ9b7mpRlhQNe')
Parse.serverURL = "https://parseapi.back4app.com/"

const createUser = async function () {
  const newNomeUsuarioValue = newNomeUsuario;
  
}

/*
import axios from "axios";

const urlUsuario = "https://parseapi.back4app.com/classes/Usuario";
const headers = {
  "X-Parse-Application-Id": "CbKjS13gKu6xDLXp0pMNjWrBl3RpvPazUvDKEzj2",
  "X-Parse-JavaScript-Key": "lDVd6yFMJgcnosLzKv1del0SlGFtJ9b7mpRlhQNe",
};

const headersJson = {
  ...headers,
  "Content-Type": "application/json",
};


export async function getUsuario() {
  const response = await axios.get(urlUsuario, { headers: headers });
  return response.data.results;
}

export async function createUser(novoUsuario) {
  return axios.post(urlUsuario, novoUsuario, {
    headers: headersJson,
  });
}

import Parse from 'parse/react-native';
import { AsyncStorage } from 'react-native';

// Initialize Parse only once
Parse.setAsyncStorage(AsyncStorage);
Parse.initialize('CbKjS13gKu6xDLXp0pMNjWrBl3RpvPazUvDKEzj2', 'lDVd6yFMJgcnosLzKv1del0SlGFtJ9b7mpRlhQNe');
Parse.serverURL = 'https://parseapi.back4app.com/classes/Usuarios';

export async function createUser(){
  const usuario = new Parse.User();
  usuario.set("username","teste1");
  usuario.set("password","123");
  usuario.set("email","email@gmail.com");

  try {
    await usuario.signUp();
    alert("user created!")
  } catch (error) {
    alert("ERROR lol");
  }
}
*/

