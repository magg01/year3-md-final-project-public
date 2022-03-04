import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, Button, ScrollView } from 'react-native';
import CocktailTile from './CocktailTile';

export function MainScreen({navigation}) {
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
            onPress={search}
          />
          <StatusBar style="auto" />
        </SafeAreaView>
      </View>
    );
  } else if (searchResults.drinks === null){
    return (
      <View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          onChangeText={text => setSearchText(text)}
          defaultValue={searchText}
        />
        <Button
          title="Search"
          accessibilityLabel="Search for cocktails"
          onPress={search}
        />
        <Text>
          No results found
        </Text>
      </View>
    )
  } else {
    return (
      <SafeAreaView>
        <View>
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            onChangeText={text => setSearchText(text)}
            defaultValue={searchText}
          />
          <Button
            title="Search"
            accessibilityLabel="Search for cocktails"
            onPress={search}
          />
          <ScrollView contentContainerStyle={{ paddingBottom: 1000 }}>
            {searchResults.drinks.map((drink) => (
              <CocktailTile
                key={drink["idDrink"]}
                title={drink["strDrink"]}
                image={drink["strDrinkThumb"]+"/preview"}
                onPress={() => {navigation.navigate("CocktailDetail", {drink})}}
              />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
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
