import { getAntecedenteDetalhes, getAntecedentes, getClasseDetalhes, getClasses, getRacaDetalhes, getRacas } from '@/api/dndApi';
import { addPersonagem, deletePersonagem, getPersonagens, updatePersonagem } from '@/api/index';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Platform, ScrollView, StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';

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
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CRIAR PERSONAGEM</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.topicText}>Novo Personagem</Text>
          
          <Text style={styles.normalText}>Nome:</Text>
          <TextInput 
            style={styles.form}
            value={form.nome}
            onChangeText={(text) => setForm({nome: text, raca:form.raca, classe:form.raca, antecedente: form.antecedente, background: form.background})}
          />
          
          <Text style={styles.normalText}>Raça:</Text>
          <Picker 
            onValueChange={carregarRacaDetalhes} 
            selectedValue={form.raca} 
            style={styles.form}
            dropdownIconColor="rgb(62, 39, 35)"
            itemStyle={{ color: 'black' }}
          >
            <Picker.Item value={''} label='Selecione uma raça'/>
            {racas.map(raca => (
              <Picker.Item key={raca.index} value={raca.index} label={raca.name}/>
            ))}
          </Picker>
          
          {racaDetalhes && 
            <View style={styles.detailsContainer}>
              <Text style={styles.topicText}>{racaDetalhes.name}</Text>
              <Text style={styles.normalText}>
                Velocidade: {racaDetalhes.speed}{'\n'}
                Idade: {racaDetalhes.age}{'\n'}
                Alinhamento: {racaDetalhes.alignment}{'\n'}
                Tamanho: {racaDetalhes.size_description}
              </Text>
            </View>
          }

          <Text style={styles.normalText}>Classe:</Text>
          <Picker 
            onValueChange={carregarClasseDetalhes} 
            selectedValue={form.classe} 
            style={styles.form}
            dropdownIconColor="rgb(62, 39, 35)"
            itemStyle={{ color: 'black' }}
          >
            <Picker.Item value={''} label='Selecione uma classe'/>
            {classes.map(classe => (
              <Picker.Item key={classe.index} value={classe.index} label={classe.name}/>
            ))}
          </Picker>
          
          {classeDetalhes && (
            <View style={styles.detailsContainer}>
              <Text style={styles.topicText}>{classeDetalhes.name}</Text>
              <Text style={styles.normalText}>
                Dados de vida: {classeDetalhes.hit_die}{'\n'}
                Proficiências Iniciais: {classeDetalhes.proficiency_choices?.[0]?.desc}
              </Text>
            </View>
          )}

          <Text style={styles.normalText}>Antecedente:</Text>
          <Picker 
            onValueChange={carregarAntecedenteDetalhes} 
            selectedValue={form.antecedente} 
            style={styles.form}
            dropdownIconColor="rgb(62, 39, 35)"
            itemStyle={{ color: 'black' }}
          >
            <Picker.Item value={''} label='Selecione um antecedente'/>
            {antecedentes.map(antecedente => (
              <Picker.Item key={antecedente.index} value={antecedente.index} label={antecedente.name}/>
            ))}
          </Picker>
          
          {antecedenteDetalhes && (
            <View style={styles.detailsContainer}>
              <Text style={styles.topicText}>{antecedenteDetalhes.name}</Text>
              {antecedenteDetalhes.name &&
                <Text style={styles.normalText}>
                  Descrição: {antecedenteDetalhes.feature.desc}
                </Text>
              }
            </View>
          )}

          <Text style={styles.normalText}>Background</Text>
          <TextInput 
            value={form.background} 
            onChangeText={(text) => setForm({nome:form.nome, raca:form.raca, classe:form.classe, antecedente:form.antecedente,background:text})} 
            multiline 
            numberOfLines={5} 
            style={styles.form}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>
                {editando ? 'Atualizar' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>
            {editando && (
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]} 
                onPress={() => {
                  setEditando(null);
                  setForm({ nome: '', raca: '', classe: '', antecedente: '', background: '' });
                  setRacaDetalhes(null);
                  setClasseDetalhes(null);
                  setAntecedenteDetalhes(null);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1,
    backgroundColor: 'rgb(228, 202, 164)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgb(93, 64, 55)',
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    paddingTop: 45,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
  detailsContainer: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgb(93, 64, 55)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
