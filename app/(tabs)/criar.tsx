import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
//import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
//import { getRacas, getRacaDetalhes } from '@/scripts/dndApi';


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
    user_id: '',
  });
  const [editando, setEditando] = useState(null);
  
  return (
    <ScrollView>
      <ThemedView style={styles.homepage}>
        <ThemedText type="title">Cadastro de Personagens de RPG</ThemedText>
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
});
