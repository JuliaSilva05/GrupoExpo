import { ScrollView, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
//import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
//import { getRacas, getRacaDetalhes } from '@/scripts/dndApi';
import { getAntecedentes, getClasses, getRacaDetalhes, getRacas } from '@/api/dndApi';
import { getPersonagens } from '@/api/index';
import { Picker } from '@react-native-picker/picker';

export default function CreateScreen() {
  const [personagens, setPersonagens] = useState([]);
  const [racas, setRacas] = useState([]);
  const [classes, setClasses] = useState([]);
  const [antecedentes, setAntecedentes] = useState([]);
  const [racaDetalhes, setRacaDetalhes] = useState(null);
  const [classeDetalhes, setClasseDetalhes] = useState(null);
  const [antecedenteDetalhes, setAntecedenteDetalhes] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    raca: '',
    classe: '',
    antecedente: '',
    background: '',
  });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    carregarPersonagens();
    carregarDadosDnD();
  }, []);

  async function carregarPersonagens() {
    const dados = await getPersonagens();
    setPersonagens(dados);
  }

  async function carregarDadosDnD() {
    // Carregar raças
    const racasData = await getRacas();
    setRacas(racasData);

    // Carregar classes
    const classesData = await getClasses();
    setClasses(classesData);

    // Carregar antecedentes
    const antecedentesData = await getAntecedentes();
    setAntecedentes(antecedentesData);
  }
  
  const handleChange = () => {
    const { name, value } = e.target;
    const a = {
      
    }
    setForm({
      ...form,
      [name]: value
    });

    // Carregar detalhes quando uma raça, classe ou antecedente for selecionado
    if (name === 'raca' && value) {
      carregarRacaDetalhes(value);
    } else if (name === 'classe' && value) {
      carregarClasseDetalhes(value);
    } else if (name === 'antecedente' && value) {
      carregarAntecedenteDetalhes(value);
    }
  };

  async function carregarRacaDetalhes(index: string) {
    const detalhes = await getRacaDetalhes(index);
    setRacaDetalhes(detalhes);
  }

  async function carregarClasseDetalhes(index: string) {
    const detalhes = await getClasseDetalhes(index);
    setClasseDetalhes(detalhes);
  }

  async function carregarAntecedenteDetalhes(index: string) {
    const detalhes = await getAntecedenteDetalhes(index);
    setAntecedenteDetalhes(detalhes);
  }
/*
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.nome.trim()) {
      alert('O nome do personagem é obrigatório!');
      return;
    }

    // Adicionar detalhes da raça, classe e antecedente ao personagem
    const personagemCompleto = {
      ...form,
      racaDetalhes: racaDetalhes,
      classeDetalhes: classeDetalhes,
      antecedenteDetalhes: antecedenteDetalhes
    };

    if (editando) {
      const atualizado = await updatePersonagem({ ...personagemCompleto, objectId: editando });
      if (atualizado) {
        setEditando(null);
        setForm({ nome: '', raca: '', classe: '', antecedente: '', background: ''});
        setRacaDetalhes(null);
        setClasseDetalhes(null);
        setAntecedenteDetalhes(null);
        await carregarPersonagens();
      }
    } else {
      const novoPersonagem = await addPersonagem(personagemCompleto);
      if (novoPersonagem) {
        setForm({ nome: '', raca: '', classe: '', antecedente: '', background: '' });
        setRacaDetalhes(null);
        setClasseDetalhes(null);
        setAntecedenteDetalhes(null);
        await carregarPersonagens();
      }
    }
  };

  const handleEdit = (personagem: { objectId: SetStateAction<null>; nome: any; raca: string; classe: string; antecedente: string; background: any; }) => {
    setEditando(personagem.objectId);
    setForm({
      nome: personagem.nome,
      raca: personagem.raca,
      classe: personagem.classe,
      antecedente: personagem.antecedente,
      background: personagem.background,
    });
    
    // Carregar detalhes da raça, classe e antecedente
    if (personagem.raca) {
      carregarRacaDetalhes(personagem.raca);
    }
    if (personagem.classe) {
      carregarClasseDetalhes(personagem.classe);
    }
    if (personagem.antecedente) {
      carregarAntecedenteDetalhes(personagem.antecedente);
    }
  };

  const handleDelete = async (objectId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este personagem?')) {
      await deletePersonagem({ objectId });
      await carregarPersonagens();
    }
  };

  {racas.map(raca => (
              <Picker.Item key={raca.index} value={raca.index} label={raca.name}/>
            ))}
  */



  
  return (
    <ScrollView>
      <ThemedView style={styles.homepage}>
        <ThemedText type="title">Cadastro de Personagens de RPG</ThemedText>
        <ThemedView style={styles.homepage}>
          <ThemedText>Nome:</ThemedText>
          <TextInput style={styles.form}
            value={form.nome}
            onChangeText={(text) => setForm({nome: text, raca:form.raca, classe:form.raca, antecedente: form.antecedente, background: form.background})}/>
          
          <ThemedText>Raça:</ThemedText>
          <Picker selectedValue={form.raca} style={styles.form}>
            <Picker.Item value={''} label='Selecione uma raça'/>
            {racas.map(raca => (
              <Picker.Item value={raca.index} label={raca.name}/>
            ))}
          </Picker>
          {form.raca}

          <ThemedText> {form.nome} Background</ThemedText>
          <TextInput multiline numberOfLines={5} style={styles.form}/>
          
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homepage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 25,
    padding:25,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
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
