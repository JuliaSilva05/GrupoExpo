import { addUsuario, getUsuario } from '@/api/index';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, TextInput } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import Parse from 'parse/react-native.js';
//Parse.setAsyncStorage(AsyncStorage)

//Parse.initialize("CbKjS13gKu6xDLXp0pMNjWrBl3RpvPazUvDKEzj2","lDVd6yFMJgcnosLzKv1del0SlGFtJ9b7mpRlhQNe");
//Parse.serverURL = "https://parseapi.back4app.com/"

export default function LoginScreen() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCreateAccount = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!nomeUsuario.trim() || !email.trim() || !senha.trim()){
      alert("o nome de usuario, o e-mail e a senha são obrigatórios!")
      return;
    }
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
  }

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!nomeUsuario.trim() || !email.trim() || !senha.trim()){
      alert("o nome de usuario, o e-mail e a senha são obrigatórios!")
      return;
    }
    const usuario = {
      nomeUsuario: nomeUsuario,
      email: email,
      senha: senha
    }
    const loginUsuario = await getUsuario()
    if (loginUsuario){
      alert(loginUsuario)
    }
  }
  
  const Logged = () => {
    return (
      <ThemedView style={styles.homepage}>
        <ThemedText>//Usuário: {nomeUsuario}</ThemedText>
        <ThemedText>//Email: {email}</ThemedText>
        <Button title='Logout'/>
      </ThemedView>
    )
  }

  // se usuario estiver logado mostrar o nome e email, se não, mostrar o formulario

  return (
    <ScrollView contentContainerStyle={styles.homepage}>
      <ThemedText>//Meu plano: {'\n'}//Se estiver logado</ThemedText>
      <Logged/>
      <ThemedText>//Se não estiver logado</ThemedText>
      
      <ThemedView style={styles.homepage} id='login'>
          <ThemedText type="title">Login</ThemedText>
          <ThemedText>Nome de Usuário</ThemedText>
          <TextInput
            value={nomeUsuario}
            onChangeText={(value) => setNomeUsuario(value)}
            style={styles.form} placeholder='Usuário'
          />
          <ThemedText>{nomeUsuario}</ThemedText>
          
          <ThemedText>E-mail</ThemedText>
          <TextInput       
            value={email}
            onChangeText={(value) => setEmail(value)}
            keyboardType='email-address'
            style={styles.form} placeholder='E-mail'
          />
          <ThemedText>{email}</ThemedText>
          
          <ThemedText>Senha</ThemedText>
          <TextInput         
            value={senha}
            onChangeText={(value) => setSenha(value)}
            style={styles.form} placeholder='Senha'
          />
          <ThemedText>{senha}</ThemedText>

          <Button onPress={handleLogin} title='Login'></Button>
          <ThemedText>Ou</ThemedText>
          <Button onPress={handleCreateAccount} title='Criar conta'></Button>
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
  }
});