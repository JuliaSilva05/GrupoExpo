import { getAntecedenteDetalhes, getAntecedentes, getClasseDetalhes, getClasses, getRacaDetalhes, getRacas } from '@/api/dndApi';
import { addPersonagem, deletePersonagem, getPersonagens, updatePersonagem } from '@/api/index';
import { useUserStore } from '@/store/userStore';
import { useCharacterStore } from '@/store/characterStore';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Platform, ScrollView, StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';

interface Personagem {
  objectId: string;
  nome: string;
  raca: string;
  classe: string;
  antecedente: string;
  background: string;
  usuarioId: string;
  racaDetalhes?: any;
  classeDetalhes?: any;
  antecedenteDetalhes?: any;
}

interface FormData {
  nome: string;
  raca: string;
  classe: string;
  antecedente: string;
  background: string;
  usuarioId: string;
}

interface DnDBase {
  index: string;
  name: string;
}

interface RacaDetalhes extends DnDBase {
  speed: number;
  age: string;
  alignment: string;
  size_description: string;
}

interface ClasseDetalhes extends DnDBase {
  hit_die: number;
  proficiency_choices: Array<{
    desc: string;
  }>;
}

interface AntecedenteDetalhes extends DnDBase {
  feature: {
    desc: string;
  };
}

export default function CreateScreen() {
  const { isLoggedIn, id: userId } = useUserStore();
  const { characters, fetchCharacters, addCharacter, updateCharacter, deleteCharacter } = useCharacterStore();
  const [racas, setRacas] = useState<DnDBase[]>([]);
  const [classes, setClasses] = useState<DnDBase[]>([]);
  const [antecedentes, setAntecedentes] = useState<DnDBase[]>([]);
  const [racaDetalhes, setRacaDetalhes] = useState<RacaDetalhes | null>(null);
  const [classeDetalhes, setClasseDetalhes] = useState<ClasseDetalhes | null>(null);
  const [antecedenteDetalhes, setAntecedenteDetalhes] = useState<AntecedenteDetalhes | null>(null);
  const [form, setForm] = useState<FormData>({
    nome: '',
    raca: '',
    classe: '',
    antecedente: '',
    background: '',
    usuarioId: '',
  });
  const [editando, setEditando] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      console.log('Usuário logado, ID:', userId);
      fetchCharacters(userId);
      carregarDadosDnD();
      setForm(prev => ({ ...prev, usuarioId: userId }));
    }
  }, [isLoggedIn, userId]);

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
    setForm({...form, raca: index});
    const detalhes = await getRacaDetalhes(index);
    setRacaDetalhes(detalhes);
  }

  async function carregarClasseDetalhes(index: string) {
    setForm({...form, classe: index});
    const detalhes = await getClasseDetalhes(index);
    setClasseDetalhes(detalhes);
  }

  async function carregarAntecedenteDetalhes(index: string) {
    setForm({...form, antecedente: index});
    const detalhes = await getAntecedenteDetalhes(index);
    setAntecedenteDetalhes(detalhes);
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      Alert.alert('Erro', 'Você precisa estar logado para criar um personagem.');
      return;
    }

    if (!userId) {
      Alert.alert('Erro', 'ID do usuário não encontrado. Por favor, faça login novamente.');
      return;
    }

    if (!form.nome.trim()) {
      alert('O nome do personagem é obrigatório!');
      return;
    }

    try {
      console.log('Estado atual do usuário:', { isLoggedIn, userId });
      console.log('Formulário atual:', form);
      
      const personagemCompleto = {
        nome: form.nome,
        raca: form.raca,
        classe: form.classe,
        antecedente: form.antecedente,
        background: form.background,
        usuarioId: userId,
      };

      console.log('Tentando criar/atualizar personagem:', personagemCompleto);

      if (editando) {
        const atualizado = await updatePersonagem({ ...personagemCompleto, objectId: editando });
        if (atualizado) {
          setEditando(null);
          setForm({ nome: '', raca: '', classe: '', antecedente: '', background: '', usuarioId: userId });
          setRacaDetalhes(null);
          setClasseDetalhes(null);
          setAntecedenteDetalhes(null);
          updateCharacter(atualizado);
          alert('Personagem atualizado com sucesso!');
        }
      } else {
        const novoPersonagem = await addPersonagem(personagemCompleto);
        if (novoPersonagem) {
          setForm({ nome: '', raca: '', classe: '', antecedente: '', background: '', usuarioId: userId });
          setRacaDetalhes(null);
          setClasseDetalhes(null);
          setAntecedenteDetalhes(null);
          addCharacter(novoPersonagem);
          alert('Personagem criado com sucesso!');
        }
      }
    } catch (error: any) {
      console.error('Erro ao salvar personagem:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível salvar o personagem. Tente novamente.');
    }
  };

  const handleEdit = async (personagem: Personagem) => {
    setEditando(personagem.objectId);
    setForm({
      nome: personagem.nome,
      raca: personagem.raca,
      classe: personagem.classe,
      antecedente: personagem.antecedente,
      background: personagem.background,
      usuarioId: personagem.usuarioId,
    });
    
    // Carregar detalhes da raça, classe e antecedente
    if (personagem.raca) {
      const racaDetalhes = await getRacaDetalhes(personagem.raca);
      setRacaDetalhes(racaDetalhes);
    }
    if (personagem.classe) {
      const classeDetalhes = await getClasseDetalhes(personagem.classe);
      setClasseDetalhes(classeDetalhes);
    }
    if (personagem.antecedente) {
      const antecedenteDetalhes = await getAntecedenteDetalhes(personagem.antecedente);
      setAntecedenteDetalhes(antecedenteDetalhes);
    }
  };

  const handleDelete = async (objectId: string) => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Alert.alert('Tem certeza que deseja excluir este personagem?', '',
        [
          { text: 'Cancelar' },
          {
            text: 'Sim',
            onPress: async () => {
              await deletePersonagem({ objectId });
              deleteCharacter(objectId);
            }
          },
        ])
    } else if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja excluir este personagem?')) {
        await deletePersonagem({ objectId });
        deleteCharacter(objectId);
      }
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CRIAR PERSONAGEM</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {!isLoggedIn ? (
            <View style={styles.loginRequired}>
              <Text style={styles.topicText}>Login Necessário</Text>
              <Text style={styles.normalText}>
                Você precisa estar logado para criar um personagem.
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.topicText}>Novo Personagem</Text>
              
              <Text style={styles.normalText}>Nome:</Text>
              <TextInput 
                style={styles.form}
                value={form.nome}
                onChangeText={(text) => setForm({...form, nome: text})}
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
                onChangeText={(text) => setForm({...form, background: text})} 
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
                      setForm({ nome: '', raca: '', classe: '', antecedente: '', background: '', usuarioId: userId });
                      setRacaDetalhes(null);
                      setClasseDetalhes(null);
                      setAntecedenteDetalhes(null);
                    }}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
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
  loginRequired: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
});
