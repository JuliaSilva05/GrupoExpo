import { deletePersonagem, getPersonagens, updatePersonagem } from '@/api/index';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';

export default function PersonagensScreen() {
  const [personagens, setPersonagens] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    raca: '',
    classe: '',
    antecedente: '',
    background: '',
  });

  useEffect(() => {
    carregarPersonagens();
  }, []);

  async function carregarPersonagens() {
    const dados = await getPersonagens();
    setPersonagens(dados);
  }

  const handleEdit = (personagem: object) => {
    setEditando(personagem.objectId);
    setForm({
      nome: personagem.nome,
      raca: personagem.raca,
      classe: personagem.classe,
      antecedente: personagem.antecedente,
      background: personagem.background,
    });
  };

  const handleUpdate = async () => {
    if (!form.nome.trim()) {
      alert('O nome do personagem é obrigatório!');
      return;
    }

    const atualizado = await updatePersonagem({ ...form, objectId: editando });
    if (atualizado) {
      setEditando(null);
      setForm({ nome: '', raca: '', classe: '', antecedente: '', background: '' });
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

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PERSONAGENS</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {editando ? (
            <View style={styles.editContainer}>
              <Text style={styles.topicText}>Editar Personagem</Text>
              
              <Text style={styles.normalText}>Nome:</Text>
              <TextInput
                style={styles.form}
                value={form.nome}
                onChangeText={(text) => setForm({ ...form, nome: text })}
              />

              <Text style={styles.normalText}>Raça:</Text>
              <TextInput
                style={styles.form}
                value={form.raca}
                onChangeText={(text) => setForm({ ...form, raca: text })}
              />

              <Text style={styles.normalText}>Classe:</Text>
              <TextInput
                style={styles.form}
                value={form.classe}
                onChangeText={(text) => setForm({ ...form, classe: text })}
              />

              <Text style={styles.normalText}>Antecedente:</Text>
              <TextInput
                style={styles.form}
                value={form.antecedente}
                onChangeText={(text) => setForm({ ...form, antecedente: text })}
              />

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
                    setForm({ nome: '', raca: '', classe: '', antecedente: '', background: '' });
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
                    Raça: {p.racaDetalhes ? p.racaDetalhes.name : p.raca}{'\n'}
                    Classe: {p.classeDetalhes ? p.classeDetalhes.name : p.classe}{'\n'}
                    Antecedente: {p.antecedenteDetalhes ? p.antecedenteDetalhes.name : p.antecedente}{'\n'}
                    Background: {p.background}
                  </Text>
                  <View style={styles.buttonContainer}>
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
}); 