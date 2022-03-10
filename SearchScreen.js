import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { SafeAreaView, StyleSheet, Text, Image, View, ScrollView } from 'react-native';
import CocktailTile from './CocktailTile';
import { LoadingAnimation } from './LoadingAnimation'
import { isInRecipeBook } from './RecipeBook'

export function SearchScreen({navigation, route}) {
  const [searchResults, setSearchResults] = useState(undefined);
  const abortController = new AbortController();
  const signal = abortController.signal;

  useEffect(() => {
    (async () => {
      try{
        //below for simulating network delay - REMOVE BEFORE SUBMISSION
        const response = await fetch(`https://deelay.me/2000/https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${route.params.searchText}`,{
        //const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`,{
          signal: signal,
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        })
        const json = await response.json();
        setSearchResults(json);
      } catch (e) {
        console.log(`SearchScreen: useEffect fetch encountered an error -> ${e}`);
      }
    })();
    return () => abortController.abort();
  },[]);

  if (searchResults === undefined){
    return (
      <LoadingAnimation
        loadingMessage="mixing results"
      />
    );
  } else  if (searchResults.drinks === null){
    return (
      <View>
        <Text>
          No results found
        </Text>
      </View>
    );
  } else {
    return (
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ paddingBottom: 1000 }}>
          {searchResults.drinks.map((drink) => (
            <CocktailTile
              key={drink["idDrink"]}
              title={drink["strDrink"]}
              image={drink["strDrinkThumb"]+"/preview"}
              onPress={async () => {
                if(await isInRecipeBook(drink["idDrink"])) {
                  navigation.navigate("CocktailDetailRecipeBook", {drinkId: drink["idDrink"]})
                } else {
                  navigation.navigate("CocktailDetailApi", {drinkId: drink["idDrink"]})
                }
              }}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
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
