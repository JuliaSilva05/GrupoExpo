import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AboutScreen() {
  return (
    /*
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      */
      <ThemedView style={styles.homepage}>
        <ThemedText type="title">Sobre</ThemedText>
        <ThemedText>Projeto para a cadeira 'Programação Web e Mobile' 2025.1</ThemedText>
        <ThemedText>Professor : Márcio Augusto Silva Bueno</ThemedText>
        <ThemedText type='title'>Feito por:</ThemedText>
        <ThemedText>Rafael Sampaio e Silva</ThemedText>
        <ThemedText>Gabriel Martins de Souza</ThemedText>
        <ThemedText>Júlia Silva Souto</ThemedText>
        <ThemedText>Matheus Veríssimo Rodrigues Pinheiro</ThemedText>
      </ThemedView>
      
    //</ParallaxScrollView>
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
