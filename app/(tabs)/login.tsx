import { addUsuario } from '@/api/index';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, TextInput } from 'react-native';


// ainda falta arrumar um jeito de "exportar" a variável de id do usuario para a tab "criar",
// e fazer aparecer lá somente os personagens em q o UsuarioId do personagem é igual ao objectId 
// do usuário q fez login. O login tbm tá com um pequeno erro

import axios from "axios";
import { useUserStore } from '@/store/userStore';

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
  const [loading, setLoading] = useState(false);

  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const logout = useUserStore((s) => s.logout);

  // LOGIN
  async function handleLogin() {
    setLoading(true);
    try {
      const res = await axios.get(urlUsuario, { headers });
      const found = res.data.results.find(
        (u) => u.email === email && u.nomeUsuario === nomeUsuario
      );
      if (!found) {
        Alert.alert("Usuário não encontrado ou nome/email incorretos");
        setLoading(false);
        return;
      }
      if (found.senha !== senha) {
        Alert.alert("Senha incorreta!");
        setLoading(false);
        return;
      }
      setUser({
        objectId: found.objectId,
        nomeUsuario: found.nomeUsuario,
        email: found.email,
      });
      setLoading(false);
    } catch (e) {
      Alert.alert("Erro ao logar");
      setLoading(false);
    }
  }

  // CADASTRO
  async function handleCreateAccount() {
    setLoading(true);
    if (!nomeUsuario.trim() || !email.trim() || !senha.trim()) {
      Alert.alert("O nome de usuário, o e-mail e a senha são obrigatórios!");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(urlUsuario, { headers });
      const existsEmail = res.data.results.some((u) => u.email === email);
      const existsNome = res.data.results.some((u) => u.nomeUsuario === nomeUsuario);
      if (existsEmail || existsNome) {
        Alert.alert("Já existe alguém com esse nome e/ou email");
        setLoading(false);
        return;
      }
      const usuario = { nomeUsuario, email, senha };
      const novoUsuario = await addUsuario(usuario);
      if (novoUsuario) {
        Alert.alert("Conta criada! Faça login.");
        setNomeUsuario('');
        setEmail('');
        setSenha('');
      }
      setLoading(false);
    } catch (e) {
      Alert.alert("Erro ao criar conta");
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
  }

  return (
    <ScrollView contentContainerStyle={styles.homepage}>
      <ThemedView style={styles.homepage}>
        {user ? (
          <ThemedView style={styles.homepage}>
            <ThemedText>Usuário: {user.nomeUsuario}</ThemedText>
            <ThemedText>Email: {user.email}</ThemedText>
            <Button onPress={handleLogout} title='Logout' />
          </ThemedView>
        ) : (
          <ThemedView style={styles.homepage}>
            <ThemedText type="title">Login</ThemedText>
            <ThemedText>Nome de Usuário</ThemedText>

            <TextInput
              value={nomeUsuario}
              onChangeText={setNomeUsuario}
              style={styles.form} placeholder='Usuário'
            />

            <ThemedText>E-mail</ThemedText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              style={styles.form} placeholder='E-mail'
            />

            <ThemedText>Senha</ThemedText>
            <TextInput
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              style={styles.form} placeholder='Senha'
            />
            <Button onPress={handleLogin} title={loading ? 'Entrando...' : 'Login'} />
            <ThemedText>Ou</ThemedText>
            <Button onPress={handleCreateAccount} title={loading ? 'Criando...' : 'Criar conta'} />
          </ThemedView>
        )}
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