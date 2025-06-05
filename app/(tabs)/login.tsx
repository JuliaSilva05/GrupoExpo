import { addUsuario } from '@/api/index';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';


// ainda falta arrumar um jeito de "exportar" a variável de id do usuario para a tab "criar",
// e fazer aparecer lá somente os personagens em q o UsuarioId do personagem é igual ao objectId 
// do usuário q fez login. O login tbm tá com um pequeno erro

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
    setNomeUsuario('');
    setEmail('');
    setSenha('');
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
      alert("O nome de usuário, o e-mail e a senha são obrigatórios!")
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
  
  function jaExiste(){
    axios.get(urlUsuario,{headers})
    .then(response => {
      setExisteNome(false);
      setExisteEmail(false);
      setSenhaCorreta(false)
      for (var i = 0; i < response.data.results.length; i++){
        if (response.data.results[i].email == email && response.data.results[i].nomeUsuario == nomeUsuario){
          setExisteNome(true)
          setExisteEmail(true)
          if (response.data.results[i].senha == senha){
            setNomeLogged(nomeUsuario)
            setEmailLogged(email)
            setSenhaCorreta(true)
            setIdUsuario(response.data.results[i].objectId)
          } else {
            Alert.alert("Senha incorreta!")
          }
          return;
        }         
        else {
          if (response.data.results[i].email == email){
            setExisteNome(false)
            setExisteEmail(true)
            setSenhaCorreta(false)
            Alert.alert("E-mail já existe!")
            return
          }
          if (response.data.results[i].nomeUsuario == nomeUsuario){
            setExisteNome(true)
            setExisteEmail(false)
            setSenhaCorreta(false)
            Alert.alert("Este nome de usuário já existe!")
            return
          }
        }
      }
      Alert.alert("Não existe uma conta assim")
      return 
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

  // se usuario estiver logado mostrar o nome e email, se não, mostrar o formulario
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerText}>LOGIN</Text>
      </View>

      <View style={styles.container}>
        { nomeLogged!='' && emailLogged && senhaCorreta &&
          <View style={styles.userInfo}>
            <Text style={styles.topicText}>Bem-vindo, {nomeLogged}!</Text>
            <Text style={styles.normalText}>Email: {emailLogged}</Text>
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        }

        { !nomeLogged && !emailLogged && !senhaCorreta &&
          <View style={styles.formContainer}>
            <Text style={styles.topicText}>Login</Text>
            
            <Text style={styles.normalText}>Nome de Usuário</Text>
            <TextInput
              value={nomeUsuario}
              onChangeText={(value) => setNomeUsuario(value)}
              style={styles.form} 
              placeholder='Usuário'
              placeholderTextColor="rgba(62, 39, 35, 0.6)"
            />
            
            <Text style={styles.normalText}>E-mail</Text>
            <TextInput       
              value={email}
              onChangeText={(value) => setEmail(value)}
              keyboardType='email-address'
              style={styles.form} 
              placeholder='E-mail'
              placeholderTextColor="rgba(62, 39, 35, 0.6)"
            />
            
            <Text style={styles.normalText}>Senha</Text>
            <TextInput     
              secureTextEntry    
              value={senha}
              onChangeText={(value) => setSenha(value)}
              style={styles.form} 
              placeholder='Senha'
              placeholderTextColor="rgba(62, 39, 35, 0.6)"
            />

            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={jaExiste}
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <Text style={styles.normalText}>Ou</Text>

            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={handleCreateAccount}
            >
              <Text style={styles.buttonText}>Criar Conta</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1,
    backgroundColor: 'rgb(228, 202, 164)',
  },
  header: {
    width: '100%',
    height: '10.5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(53, 22, 22)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgb(93, 64, 55)',
  },
  headerText: { 
    color: 'rgb(228, 202, 164)',
    fontSize: 34,
    marginTop: 30,
    fontFamily: 'Draconis',
  },
  container: {
    flex: 1,
    paddingTop: 45,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  userInfo: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  topicText: { 
    color: 'rgb(62, 39, 35)',
    fontSize: 28,
    marginTop: 42,
    fontFamily: 'BreatheFire',
    textAlign: 'center',
  },
  normalText: { 
    color: 'rgb(62, 39, 35)',
    fontSize: 20,
    marginTop: 15,
    fontFamily: 'Vecna',
    textAlign: 'center',
  },
  form: {
    borderColor: 'rgb(93, 64, 55)',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 8,
    textAlign: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: '80%',
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'Vecna',
    fontSize: 18,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: 'rgb(233, 84, 47)',
    borderColor: 'rgb(180, 65, 36)',
  },
  secondaryButton: {
    backgroundColor: 'rgb(93, 64, 55)',
    borderColor: 'rgb(62, 39, 35)',
  },
  buttonText: {
    color: 'rgb(228, 202, 164)',
    fontSize: 18,
    fontFamily: 'BreatheFire',
    textAlign: 'center',
  },
});