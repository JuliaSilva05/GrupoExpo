import {ImageBackground, View, ScrollView, StyleSheet, Text, Button, Image} from 'react-native';
import { ExternalLink } from '@/components/ExternalLink';

export default function HomeScreen() {
  return (

      <View style = {styles.root}>

        <View style = {styles.header}> 
                <Text style = {styles.headerText}>RPG FICHA FÁCIL</Text>
        </View>

        <ScrollView contentContainerStyle={{flexGrow:1}}>
        <View style={styles.container}>

        <Text style = {styles.topicText}>Bem Vindo!</Text>
        <Text style = {styles.normalText}>O RPG Ficha Fácil é o melhor app para criar fichas para seus personagens de RPG!</Text>

        <Text style = {styles.topicText}>Crie</Text>
        <Text style = {styles.normalText}>Use a tela de criação integrada com a API D&D 5e para facilmente criar o personagem da sua imaginação.</Text>

        <Text style = {styles.topicText}>Organize</Text>
        <Text style = {styles.normalText}>Salve seus personagens para agrupar todos os aventureiros que você precisa para sua próxima jornada.</Text>

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

    header:
    {
        width: '100%',
        height: '10.5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent : 'center',
        backgroundColor: 'rgb(53, 22, 22)',
        borderBottomWidth: 2,
        borderBottomColor: 'rgb(93, 64, 55)',
    },

     container: 
     {
        flex: 1,
        paddingTop : 45,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    

    headerText:
    { 
        color: 'rgb(228, 202, 164)',
        fontSize: 34,
        marginTop: 30,
        fontFamily: 'Draconis',
    },

    topicText:
    { 
        color: 'rgb(62, 39, 35)',
        fontSize: 28,
        marginTop: 42,
        fontFamily: 'BreatheFire',
        textAlign: 'center',
    },

    normalText:
    { 
        color: 'rgb(62, 39, 35)',
        fontSize: 20,
        marginTop: 15,
        width: '70%',
        fontFamily: 'Vecna',
        textAlign: 'center',
        flexShrink: 1
    },

    linkText:
    {
        color: 'rgb(62, 39, 35)',
        fontSize: 20,
        lineHeight:30,
        fontFamily: 'Vecna',
        textAlign: 'center',
        textDecorationLine: 'underline',
        textDecorationColor: 'rgb(93, 64, 55)',
    },

  centerText: {
    textAlign: 'center',
  }
});
