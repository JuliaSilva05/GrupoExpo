import { deletePersonagem, getPersonagens, updatePersonagem } from '@/api/index';
import { getAntecedenteDetalhes, getAntecedentes, getClasseDetalhes, getClasses, getRacaDetalhes, getRacas } from '@/api/dndApi';
import { useUserStore } from '@/store/userStore';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TextInput, View, Text, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Personagem {
  objectId: string;
  nome: string;
  raca: string;
  classe: string;
  antecedente: string;
  background: string;
  usuarioId: string;
  racaDetalhes?: RacaDetalhes;
  classeDetalhes?: ClasseDetalhes;
  antecedenteDetalhes?: AntecedenteDetalhes;
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

export default function PersonagensScreen() {
  const { isLoggedIn, id: userId } = useUserStore();
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [visualizando, setVisualizando] = useState<Personagem | null>(null);
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

  useEffect(() => {
    if (isLoggedIn) {
      carregarPersonagens();
      carregarDadosDnD();
    }
  }, [isLoggedIn]);

  async function carregarPersonagens() {
    try {
      const dados = await getPersonagens();
      console.log('Todos os personagens:', dados);
      console.log('ID do usuário atual:', userId);
      // Filter characters to show only those created by the logged-in user
      const userPersonagens = dados.filter((p: Personagem) => p.usuarioId === userId);
      console.log('Personagens do usuário:', userPersonagens);
      setPersonagens(userPersonagens);
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
      Alert.alert('Erro', 'Não foi possível carregar os personagens. Tente novamente.');
    }
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

  const handleUpdate = async () => {
    if (!form.nome.trim()) {
      alert('O nome do personagem é obrigatório!');
      return;
    }

    const personagemCompleto = {
      ...form,
      racaDetalhes: racaDetalhes,
      classeDetalhes: classeDetalhes,
      antecedenteDetalhes: antecedenteDetalhes,
      usuarioId: userId, // Ensure the character is associated with the current user
    };

    const atualizado = await updatePersonagem({ ...personagemCompleto, objectId: editando });
    if (atualizado) {
      setEditando(null);
      setForm({ nome: '', raca: '', classe: '', antecedente: '', background: '', usuarioId: '' });
      setRacaDetalhes(null);
      setClasseDetalhes(null);
      setAntecedenteDetalhes(null);
      await carregarPersonagens();
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
              await carregarPersonagens();
            }
          },
        ])
    } else if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja excluir este personagem?')) {
        await deletePersonagem({ objectId });
        await carregarPersonagens();
      }
    }
  };

  const handleView = async (personagem: Personagem) => {
    setVisualizando(personagem);
    
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

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        {editando ? (
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setEditando(null);
                setForm({ nome: '', raca: '', classe: '', antecedente: '', background: '', usuarioId: '' });
                setRacaDetalhes(null);
                setClasseDetalhes(null);
                setAntecedenteDetalhes(null);
              }}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>EDITAR PERSONAGEM</Text>
          </View>
        ) : (
          <Text style={styles.headerText}>PERSONAGENS</Text>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {!isLoggedIn ? (
            <View style={styles.loginRequired}>
              <Text style={styles.topicText}>Login Necessário</Text>
              <Text style={styles.normalText}>
                Você precisa estar logado para ver e gerenciar seus personagens.
              </Text>
            </View>
          ) : editando ? (
            <View style={styles.editContainer}>
              <Text style={styles.topicText}>Editar Personagem</Text>
              
              <Text style={styles.normalText}>Nome:</Text>
              <TextInput
                style={styles.form}
                value={form.nome}
                onChangeText={(text) => setForm({ ...form, nome: text })}
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

              <Text style={styles.normalText}>Background:</Text>
              <TextInput
                style={styles.form}
                value={form.background}
                onChangeText={(text) => setForm({ ...form, background: text })}
                multiline
                numberOfLines={4}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleUpdate}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => {
                    setEditando(null);
                    setForm({ nome: '', raca: '', classe: '', antecedente: '', background: '', usuarioId: '' });
                    setRacaDetalhes(null);
                    setClasseDetalhes(null);
                    setAntecedenteDetalhes(null);
                  }}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.listContainer}>
              <Text style={styles.topicText}>Seus Personagens</Text>
              {personagens.map((p) => (
                <View key={p.objectId} style={styles.personagemCard}>
                  <Text style={styles.normalText}>
                    {p.nome}{'\n'}
                    Raça: {p.racaDetalhes?.name || p.raca}{'\n'}
                    Classe: {p.classeDetalhes?.name || p.classe}{'\n'}
                    Antecedente: {p.antecedenteDetalhes?.name || p.antecedente}{'\n'}
                    Background: {p.background}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.primaryButton]}
                      onPress={() => handleView(p)}
                    >
                      <Text style={styles.buttonText}>Visualizar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.primaryButton]}
                      onPress={() => handleEdit(p)}
                    >
                      <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.secondaryButton]}
                      onPress={() => handleDelete(p.objectId)}
                    >
                      <Text style={styles.buttonText}>Deletar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={visualizando !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setVisualizando(null);
          setRacaDetalhes(null);
          setClasseDetalhes(null);
          setAntecedenteDetalhes(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{visualizando?.nome}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setVisualizando(null);
                  setRacaDetalhes(null);
                  setClasseDetalhes(null);
                  setAntecedenteDetalhes(null);
                }}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {racaDetalhes && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.topicText}>Raça: {racaDetalhes.name}</Text>
                  <Text style={styles.normalText}>
                    Velocidade: {racaDetalhes.speed}{'\n'}
                    Idade: {racaDetalhes.age}{'\n'}
                    Alinhamento: {racaDetalhes.alignment}{'\n'}
                    Tamanho: {racaDetalhes.size_description}
                  </Text>
                </View>
              )}

              {classeDetalhes && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.topicText}>Classe: {classeDetalhes.name}</Text>
                  <Text style={styles.normalText}>
                    Dados de vida: {classeDetalhes.hit_die}{'\n'}
                    Proficiências Iniciais: {classeDetalhes.proficiency_choices?.[0]?.desc}
                  </Text>
                </View>
              )}

              {antecedenteDetalhes && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.topicText}>Antecedente: {antecedenteDetalhes.name}</Text>
                  <Text style={styles.normalText}>
                    Descrição: {antecedenteDetalhes.feature.desc}
                  </Text>
                </View>
              )}

              <View style={styles.detailsContainer}>
                <Text style={styles.topicText}>Background</Text>
                <Text style={styles.normalText}>{visualizando?.background}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    height: '12%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(53, 22, 22)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgb(93, 64, 55)',
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 50,
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 10,
    zIndex: 1,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgb(228, 202, 164)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(53, 22, 22, 0.8)',
  },
  backButtonText: {
    color: 'rgb(228, 202, 164)',
    fontSize: 34,
    fontFamily: 'Draconis',
    marginTop: -5,
  },
  headerText: {
    color: 'rgb(228, 202, 164)',
    fontSize: 34,
    fontFamily: 'Draconis',
    textAlign: 'center',
    flex: 1,
    marginTop: 0,
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
  editContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  listContainer: {
    width: '100%',
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
  personagemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'rgb(228, 202, 164)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgb(93, 64, 55)',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: 'rgb(62, 39, 35)',
    fontSize: 28,
    fontFamily: 'BreatheFire',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: 'rgb(62, 39, 35)',
    fontSize: 28,
    fontFamily: 'BreatheFire',
  },
  modalScroll: {
    maxHeight: '100%',
  },
}); 