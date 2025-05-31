import { addUsuario } from '@/api/index';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, TextInput } from 'react-native';


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

//export const [idUsuario, setIdUsuario] = useState('');;

export default function LoginScreen() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [nomeLogged, setNomeLogged] = useState('');
  const [emailLogged, setEmailLogged] = useState('');

  const [existeNome, setExisteNome] = useState(false);
  const [existeEmail, setExisteEmail] = useState(false);
  const [senhaCorreta, setSenhaCorreta] = useState(false);
  
  const [idUsuario, setIdUsuario] = useState('');

  const handleLogout = () => {
    setNomeLogged('');
    setEmailLogged('');
    setExisteNome(false);
    setExisteEmail(false);
    setSenhaCorreta(false);
    setIdUsuario('');
  }
  const handleCreateAccount = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!nomeUsuario.trim() || !email.trim() || !senha.trim()){
      alert("o nome de usuario, o e-mail e a senha são obrigatórios!")
      return;
    }
    jaExiste()
    if (existeNome == false && existeEmail == false){
      const usuario = {
        nomeUsuario: nomeUsuario,
        email: email,
        senha: senha
      }
      const novoUsuario = await addUsuario(usuario)
      if (novoUsuario){
        alert("Você criou uma conta! Agora é só colocar os dados de novo e clicar em \"Login\"!")
        setNomeUsuario('')
        setEmail('')
        setSenha('')
      }
    } else {
      Alert.alert("Já existe alguém com esse nome e/ou email")
    }
  }
  
  const handleLogin = () => {
    jaExiste();
    if (existeNome == true && existeEmail == true && senhaCorreta == false){
      console.error("senha incorreta!")
    } else if (existeNome == false || existeEmail == false) {
      console.error("Conta não existe!")
    }
  }

  function jaExiste(){
    axios.get(urlUsuario,{headers})
    .then(response => {
      setExisteNome(false);
      setExisteEmail(false);
      setSenhaCorreta(false)
      //setExiste(false)
      for (var i = 0; i < response.data.results.length; i++){
        if (response.data.results[i].email == email && response.data.results[i].nomeUsuario == nomeUsuario){
          setExisteEmail(true)
          setExisteNome(true)
          if (response.data.results[i].senha == senha){
            setSenhaCorreta(true);
            setNomeLogged(nomeUsuario)
            setEmailLogged(email)
            setIdUsuario(response.data.results[i].objectId)
            //Alert.alert(JSON.stringify(response.data.results[i].objectId))
          } else {
            console.error('senha incorreta!')
          }
          //setExiste(true)
          Alert.alert("ja existe essa exata conta", JSON.stringify(i))
          //console.error(JSON.stringify(response.data.results[i]))
          return;
        }         
        else {
          if (response.data.results[i].email == email){
            setExisteEmail(true)
            setExisteNome(false);
            setSenhaCorreta(false)
            Alert.alert("ja existe o email")
            //console.error(JSON.stringify(response.data.results[i]))
            return;
          }
          if (response.data.results[i].nomeUsuario == nomeUsuario){
            Alert.alert("ja existe o nome")
            setExisteEmail(false);
            setExisteNome(true)
            setSenhaCorreta(false)
            return;
          }
        }
      }
      Alert.alert("nao existe")
      return;      
    })
    .catch(error => {
      // Handle login error
      console.error('Login failed', error.response);
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
      setExisteEmail(false)
      setExisteNome(false)
      setSenhaCorreta(false)
      return;
    });
  }


  

  const Logged = () => {
    return (
      <ThemedView style={styles.homepage}>
        <ThemedText>Usuário: {nomeLogged}</ThemedText>
        <ThemedText>Email: {emailLogged}</ThemedText>
        <Button onPress={handleLogout} title='Logout'/>
      </ThemedView>
    )
  }

  // se usuario estiver logado mostrar o nome e email, se não, mostrar o formulario

  return (
    <ScrollView contentContainerStyle={styles.homepage}>
      <ThemedView style={styles.homepage}>
        { nomeLogged && emailLogged && senhaCorreta &&
          <ThemedView style={styles.homepage}>
            <ThemedText>Usuário: {nomeLogged}</ThemedText>
            <ThemedText>Email: {emailLogged}</ThemedText>
            <Button onPress={handleLogout} title='Logout'/>
          </ThemedView>
        }
        { !nomeLogged && !emailLogged && !senhaCorreta &&
          <ThemedView style={styles.homepage}>
            <ThemedText type="title">Login</ThemedText>
            <ThemedText>Nome de Usuário</ThemedText>
          
            <TextInput
              value={nomeUsuario}
              onChangeText={(value) => setNomeUsuario(value)}
              style={styles.form} placeholder='Usuário'
            />
            
            <ThemedText>E-mail</ThemedText>
            <TextInput       
              value={email}
              onChangeText={(value) => setEmail(value)}
              keyboardType='email-address'
              style={styles.form} placeholder='E-mail'
            />
            
            <ThemedText>Senha</ThemedText>
            <TextInput     
              secureTextEntry    
              value={senha}
              onChangeText={(value) => setSenha(value)}
              style={styles.form} placeholder='Senha'
            />

            <Button onPress={handleLogin} title='Login'></Button>
            <ThemedText>Ou</ThemedText>
            <Button onPress={handleCreateAccount} title='Criar conta'></Button>
          </ThemedView>
        }
        </ThemedView>
          
            
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  homepage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 25,
    padding: 25,
  },
  form: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: 250,
    paddingBottom: 10,
  }
});