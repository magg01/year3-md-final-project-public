import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, Button } from 'react-native';

export function MainScreen() {
  const [searchText, setSearchText] = useState('');

  const executeSearch = () => {
    alert(searchText);
  }


  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          onChangeText={text => setSearchText(text)}
          defaultValue={searchText}
        />
        <Button
          title="Search"
          accessibilityLabel="Search for cocktails"
          onPress={executeSearch}
        />
        <StatusBar style="auto" />
      </SafeAreaView>
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
  searchBar:{
    height: 50,
    width: 200,
    borderWidth: 2,
    borderColor: 'black',
  }

});
