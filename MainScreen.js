import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, Button } from 'react-native';

export function MainScreen() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(undefined);

  const search =
    async () => {
      fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`,{
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        setSearchResults(json);
      }).catch((error) => {
        console.log(`There was an error -> ${error}`);
      });
    };

  const executeSearch = () => {
    search();
  }

  if(searchResults === undefined){
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
  } else {
    return (
      <Text>
        {JSON.stringify(searchResults)}
      </Text>
    )
  }
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
