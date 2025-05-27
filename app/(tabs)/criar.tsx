import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
//import { getRacas, getRacaDetalhes } from '@/scripts/dndApi';


export default function CreateScreen() {

  
  return (
    <ScrollView>
      <ThemedView>
        <ThemedText type="title">Cadastro de Personagens de RPG</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
