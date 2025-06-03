import { getAntecedenteDetalhes, getAntecedentes, getClasseDetalhes, getClasses, getRacaDetalhes, getRacas } from '@/api/dndApi';
import { addPersonagem, deletePersonagem, getPersonagens, updatePersonagem } from '@/api/index';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Platform, ScrollView, StyleSheet, TextInput } from 'react-native';

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


  async function carregarRacaDetalhes(index: string) {
    setForm({nome:form.nome, raca:index, classe:form.classe, antecedente:form.antecedente, background:form.background})
    const detalhes = await getRacaDetalhes(index);
    setRacaDetalhes(detalhes);
  }

  async function carregarClasseDetalhes(index: string) {
    setForm({nome:form.nome, raca:form.raca, classe:index, antecedente:form.antecedente, background:form.background})
    const detalhes = await getClasseDetalhes(index);
    setClasseDetalhes(detalhes);
  }

  async function carregarAntecedenteDetalhes(index: string) {
    setForm({nome:form.nome, raca:form.raca, classe:form.classe, antecedente:index, background:form.background})
    const detalhes = await getAntecedenteDetalhes(index);
    setAntecedenteDetalhes(detalhes);
  }

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

  const handleEdit = (personagem: object) => {
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
    if (Platform.OS === 'android' || Platform.OS === 'ios'){
      Alert.alert('Tem certeza que deseja excluir este personagem?', '',
      [
        { text: 'Cancelar'},
        { text: 'Sim',
          onPress: async () => {
            await deletePersonagem({ objectId });
            await carregarPersonagens();
          }          
        },
      ])
    } else if (Platform.OS === 'web'){
      if (window.confirm('Tem certeza que deseja excluir este personagem?')) {
        await deletePersonagem({ objectId });
        await carregarPersonagens();
      }
    }

    /*
    if (window.confirm('Tem certeza que deseja excluir este personagem?')) {
      await deletePersonagem({ objectId });
      await carregarPersonagens();
    }*/
  };

/*
<FlatList data={personagens} renderItem={({item}) => 
              <ThemedView>
                <ThemedText>
                  {item.nome} {'\n'}
                  Raça: {item.racaDetalhes ? item.racaDetalhes.name : item.raca} {'\n'}
                  Classe: {item.classeDetalhes ? item.classeDetalhes.name : item.classe} {'\n'}
                  Antecedente: {item.antecedenteDetalhes ? item.antecedenteDetalhes.name : item.antecedente} {'\n'}
                  Background: {item.background}
                </ThemedText>
                <Button onPress={() => handleEdit(item)} title='Editar'/>
                <Button onPress={() => handleDelete(item)} title='Deletar'/>
                
              </ThemedView>}
            />
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
          <Picker onValueChange={carregarRacaDetalhes} selectedValue={form.raca} style={styles.form}>
            <Picker.Item value={''} label='Selecione uma raça'/>
            {racas.map(raca => (
              <Picker.Item value={raca.index} label={raca.name}/>
            ))}
          </Picker>
          {racaDetalhes && 
            <ThemedView>
              <ThemedText type='title'>{racaDetalhes.name}</ThemedText>
              <ThemedText>
                Velocidade: {racaDetalhes.speed}{'\n'}
                Idade: {racaDetalhes.age}{'\n'}
                Alinhamento: {racaDetalhes.alignment}{'\n'}
                Tamanho: {racaDetalhes.size_description}{'\n'}
              </ThemedText>
            </ThemedView>
          }

          <ThemedText>Classe:</ThemedText>
          <Picker onValueChange={carregarClasseDetalhes} selectedValue={form.classe} style={styles.form}>
            <Picker.Item value={''} label='Selecione uma classe'/>
            {classes.map(classe => (
              <Picker.Item value={classe.index} label={classe.name}/>
            ))}
          </Picker>
          {classeDetalhes && (
            <ThemedView>
              <ThemedText type='title'>{classeDetalhes.name}</ThemedText>
              <ThemedText>
                Dados de vida: {classeDetalhes.hit_die}{'\n'}
                Proficiências Iniciais: {classeDetalhes.proficiency_choices?.[0]?.desc}{'\n'}
              </ThemedText>
            </ThemedView>
          )}

          <ThemedText>Antecedente:</ThemedText>
          <Picker onValueChange={carregarAntecedenteDetalhes} selectedValue={form.antecedente} style={styles.form}>
            <Picker.Item value={''} label='Selecione um antecedente'/>
            {antecedentes.map(antecedente => (
              <Picker.Item value={antecedente.index} label={antecedente.name}/>
            ))}
          </Picker>
          {antecedenteDetalhes && (
            <ThemedView>
              <ThemedText type='title'>{antecedenteDetalhes.name}</ThemedText>
                {antecedenteDetalhes.name&&
                  <ThemedText>
                    Descrição: {antecedenteDetalhes.feature.desc}{'\n'}
                  </ThemedText>
                }
            </ThemedView>
          )}

          <ThemedText>Background</ThemedText>
          <TextInput value={form.background} onChangeText={(text) => setForm({nome:form.nome, raca:form.raca, classe:form.classe, antecedente:form.antecedente,background:text})} multiline numberOfLines={5} style={styles.form}/>

          <ThemedView>
            <Button onPress={handleSubmit} title={editando ? 'Atualizar':'Cadastrar'}/>
            {editando && (
            <Button title='Cancelar' onPress={() => {
                setEditando(null);
                setForm({ nome: '', raca: '', classe: '', antecedente: '', background: '' });
                setRacaDetalhes(null);
                setClasseDetalhes(null);
                setAntecedenteDetalhes(null);
              }}
            />
          )}
          </ThemedView>

          <ThemedText type='title'>Personagens Cadastrados:</ThemedText>
          {personagens.length === 0 ? (
            <ThemedText>Nenhum personagem cadastrado ainda.</ThemedText>
          ) : (
              
            <ThemedView>
              {personagens.map((p) => (
                <ThemedView key={p.objectId}>
                  <ThemedText>
                    {p.nome} {'\n'}
                    Raça: {p.racaDetalhes ? p.racaDetalhes.name : p.raca} {'\n'}
                    Classe: {p.classeDetalhes ? p.classeDetalhes.name : p.classe} {'\n'}
                    Antecedente: {p.antecedenteDetalhes ? p.antecedenteDetalhes.name : p.antecedente} {'\n'}
                    Background: {p.background}          
                  </ThemedText>
                  <Button onPress={() => handleEdit(p)} title='Editar'/>
                  <Button onPress={() => handleDelete(p.objectId)} title='Deletar'/>
                </ThemedView>
              ))}
            </ThemedView>                     
            
          )}          
          
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
