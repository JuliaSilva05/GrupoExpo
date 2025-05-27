import { Button, ScrollView, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';

export default function LoginScreen() {
  const [usuario, setUsuario] = useState([]);
  const [email, setEmail] = useState([]);
  const [senha, setSenha] = useState([]);
  const [form, setForm] = useState({
    usuario: '',
    email: '',
    senha: '',
  });

  const SignUp = () =>{
    return(
      <ThemedView  style={styles.homepage}>
          <ThemedText type="title">Login</ThemedText>
          <ThemedText>Nome de Usuário</ThemedText>
          <TextInput style={styles.form} placeholder='Usuário'/>
          <ThemedText>E-mail</ThemedText>
          <TextInput style={styles.form} placeholder='E-mail'/>
          <ThemedText>Senha</ThemedText>
          <TextInput style={styles.form} placeholder='Senha'/>

          <Button title='Login'></Button>
          <ThemedText>Ou</ThemedText>
          <Button title='Criar uma conta'></Button>
        </ThemedView>
    )
  }
  const Logged = () => {
    return (
      <>
        <ThemedText>{usuario}</ThemedText>
        <ThemedText>{email}</ThemedText>
        <Button title='Logout'/>
      </>
    )
  }

  // se usuario estiver logado mostrar o nome e email, se não, mostrar o formulario

  return (
    <ScrollView>
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
    textAlign: 'center',
    fontSize: 25,
  },
  form: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'left',
  }
});
