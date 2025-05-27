import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
        />
      }>
      
      <ThemedView>
        <ThemedText type='title'>Bem-vindo ao RPG Ficha Fácil</ThemedText>
        <ThemedText>
          O RPG Ficha Fácil é o melhor app para criar
          fichas para seus personagens de RPG!
        </ThemedText>
        <ThemedText type='title'>Crie</ThemedText>
        <ThemedText>
          Use a página de criação integrada com a API D&D 5e para facilmente criar o 
          personagem da sua imaginação.
        </ThemedText>
        <ThemedText type='title'>Organize</ThemedText>
        <ThemedText>
          Use a página dos seus personagens para agrupar todo mundo que você precisa 
          para sua próxima jornada.
        </ThemedText>
      </ThemedView>
        
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
    textAlign: 'center',
    fontSize: 25,
  },
});
