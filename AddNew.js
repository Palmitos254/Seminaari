import { StyleSheet, Text, View, Button, TextInput, Keyboard, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { FontAwesome } from '@expo/vector-icons';

export default function AddNew({ navigation }) {

  const [text, setText] = useState("");
  const [text2, setText2] = useState("");
  const [todos, setTodos] = useState([]);
  const db = SQLite.openDatabase('coursedb.db');

  useEffect(() => {
  db.transaction(tx => {
      tx.executeSql('create table if not exists todos (id integer primary key not null, text text, text2 text);');
  }, null, updateList);
  }, []);

  //Save
  const saveItem = () => {
  db.transaction(tx => {
      tx.executeSql('insert into todos (text, text2) values (?, ?);',  [text, text2]);
  }, null, updateList)
  }

  const updateList = () => {
  db.transaction(tx => {
      tx.executeSql('select * from todos;', [], (_, { rows }) =>
      setTodos(rows._array)
      );
  }, null, null);
  }

  //Delete
  const deleteItem = (id) => {
  db.transaction(tx => {
      tx.executeSql(`delete from todos where id = ?;`, [id]);
  }, null, updateList)    
  }

  return (
    <View style={styles.container}>
      <Text>Todos nimi</Text>
      <TextInput
        style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
        placeholder='Type Here'
        onChangeText={text => setText(text)}
        value={text}
      />
      <Text>Todos kuvaus</Text>
      <TextInput
        style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
        placeholder='Type Here'
        onChangeText={text2 => setText2(text2)}
        value={text2}
      />
      <Text></Text>
      <Button onPress={saveItem} title='Save' />
      <Text></Text>
      
      <Text></Text>
      <Button onPress={() => navigation.navigate("Etusivu", {data:todos, text, text2})} title='return' />
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
});