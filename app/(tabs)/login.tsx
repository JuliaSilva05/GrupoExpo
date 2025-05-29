import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, TextInput } from 'react-native';

/*
import AsyncStorage from '@react-native-async-storage/async-storage';
import Parse from 'parse/react-native.js';
Parse.setAsyncStorage(AsyncStorage)
Parse.initialize('CbKjS13gKu6xDLXp0pMNjWrBl3RpvPazUvDKEzj2','lDVd6yFMJgcnosLzKv1del0SlGFtJ9b7mpRlhQNe')
Parse.serverURL = "https://parseapi.back4app.com/"
*/
export default function LoginScreen() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
/*
  const createUser = async function () {
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

  const SignUp = () =>{
    return(
      <ThemedView  style={styles.homepage}>
          <ThemedText type="title">Login</ThemedText>

          <ThemedText>Nome de Usuário</ThemedText>
          <TextInput          
            value={nomeUsuario}
            onChangeText={setNomeUsuario}
            style={styles.form} placeholder='Usuário'
          />
          
          <ThemedText>E-mail</ThemedText>
          <TextInput       
            onChangeText={setEmail}
            value={email}
            style={styles.form} placeholder='E-mail'
          />
          
          <ThemedText>Senha</ThemedText>
          <TextInput         
            value={senha}
            onChangeText={setSenha}    
            style={styles.form} placeholder='Senha'
          />

          <Button title='Login'></Button>
          <ThemedText>Ou</ThemedText>
          <Button title='Criar conta'></Button>
        </ThemedView>
    )
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
      
      <ThemedText>//Se não estiver logado</ThemedText>
      <SignUp/>
            
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