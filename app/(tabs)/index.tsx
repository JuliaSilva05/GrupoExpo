import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    /*
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
        />
      }>
    */  
      <ThemedView style={styles.homepage}>
        <ThemedText style={styles.centerText}>
          <ThemedText type='title'>Bem-vindo ao RPG Ficha Fácil {'\n'}</ThemedText>
            O RPG Ficha Fácil é o melhor app para criar
            fichas para seus personagens de RPG!{'\n\n'}
          <ThemedText type='title'>Crie {'\n'}</ThemedText>
            Use a página de criação integrada com a API D&D 5e para facilmente criar o 
            personagem da sua imaginação.{'\n\n'}
          <ThemedText type='title'>Organize{'\n'}</ThemedText>
            Use a página dos seus personagens para agrupar todo mundo que você precisa 
            para sua próxima jornada.{'\n'}
        </ThemedText>

      </ThemedView>
        
      
    //</ParallaxScrollView>
  );
}

export const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    textAlign: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },


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
