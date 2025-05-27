import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AboutScreen() {
  return (
      <ThemedView style={styles.homepage}>
        <ThemedText style={styles.centerText}>
          <ThemedText type="title">Sobre {'\n'}</ThemedText>
            Projeto para a cadeira 'Programação Web e Mobile' 2025.1{'\n'}
            Professor : Márcio Augusto Silva Bueno{'\n\n'}
          <ThemedText type='title'>Feito por:{'\n'}</ThemedText>
            Rafael Sampaio e Silva{'\n'}
            Gabriel Martins de Souza{'\n'}
            Júlia Silva Souto{'\n'}
            Matheus Veríssimo Rodrigues Pinheiro{'\n'}
        </ThemedText>
      </ThemedView>
      
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

  centerText: {
    textAlign: 'center',
  }
});
