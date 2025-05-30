import {ImageBackground, View, ScrollView, StyleSheet, Text, Button, Image} from 'react-native';
import { ExternalLink } from '@/components/ExternalLink';

export default function AboutScreen() {
  return (

      <View style = {styles.root}>

        <View style = {styles.header}> 
                <Text style = {styles.headerText}>SOBRE</Text>
        </View>

        <ScrollView contentContainerStyle={{flexGrow:1}}>

        <Text style = {styles.topicText}>Sobre o projeto</Text>
        <Text style = {styles.normalText}>'Programação Web E Mobile' 2025.1</Text>
        <Text style = {styles.normalText}>Professor: Márcio Augusto Silva Bueno</Text>

        <Text style = {styles.topicText}>Ferramentas usadas:</Text>
          <ExternalLink style = {{marginTop: 15}} href="https://www.dnd5eapi.co/">
            <Text style = {styles.linkText}>API D&D 5e</Text>
          </ExternalLink>
          <ExternalLink href="https://reactnative.dev/">
            <Text style = {styles.linkText}>React Native</Text>
          </ExternalLink>
          <ExternalLink href="https://expo.dev/go">
            <Text style = {styles.linkText}>Expo Go</Text>
          </ExternalLink>

        <Text style = {styles.topicText}>Feito por:</Text>
        <Text style = {styles.normalText}>Rafael Sampaio{'\n'}Gabriel Martins{'\n'}Matheus Veríssimo{'\n'}Julia Silva Souto</Text>
        </ScrollView>

      </View>
      
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1,
    backgroundColor: 'rgba(233, 220, 201, 1)',
  },

    header:
    {
        width: '100%',
        height: '10.5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent : 'center',
        backgroundColor: 'rgb(252, 217, 171)',
        borderBottomWidth: 2,
        borderBottomColor: 'rgb(93, 64, 55)',
    },

    headerText:
    { 
        color: 'rgb(62, 39, 35)',
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
        fontFamily: 'Vecna',
        textAlign: 'center',
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
