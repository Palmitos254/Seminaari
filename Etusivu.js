import { StyleSheet, Text, View, Button, TextInput, FlatList, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import * as Speech from 'expo-speech';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Etusivu({ navigation }) {

  const [text, setText] = useState("");
  const [text2, setText2] = useState("");
  const [todos, setTodos] = useState([]);

  const db = SQLite.openDatabase('coursedb.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists todos (id integer primary key not null, text text, text2 text);');
    }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into todos (text, text2) values (?, ?);',  [text, text2]);
    }, null, updateList)
    Speech.speak(text + " lisätty ostoslistaan, seuraavalla kuvauksella: ");
    Speech.speak(text2);
    setText("");
    setText2("");
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from todos;', [], (_, { rows }) =>
      setTodos(rows._array)
      );
    }, null, null);
  }

  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql(`delete from todos where id = ?;`, [id]);
    }, null, updateList)    
    Speech.speak("Esine poistettu ostoslistasta!")
  }

  return (
    <View style={styles.container}>
      <Text>Nimi</Text>
      <TextInput
        style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
        placeholder='Nimi'
        onChangeText={text => setText(text)}
        value={text}
      />
      <Text>Kuvaus/Määrä</Text>
      <TextInput
        style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
        placeholder='Kuvaus/Määrä'
        onChangeText={text2 => setText2(text2)}
        value={text2}
      />
      <Text></Text>
      <Button onPress={saveItem} title='Save' />
      <Text></Text>
      <FlatList
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
          <View style={styles.listcontainer}>
            <Entypo name='dot-single' size={24} color='black' />
            <Text>{item.text}, {item.text2} </Text>
            <MaterialCommunityIcons name='delete-forever' size={24} color='red' onPress={() => deleteItem(item.id)} />
          </View>}
        data={todos}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    flexwrap: 'wrap',
  }
});
