import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { Searchbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, TextInput, View, Button, ScrollView } from 'react-native';
import { CocktailTile } from './CocktailTile';
import { FavouritesList } from './FavouritesList';
import { SuggestedCocktails } from './SuggestedCocktails';
import { getFavourites, isInRecipeBook } from './RecipeBook';

export function MainScreen({navigation}) {
  const [searchText, setSearchText] = useState('');
  const [favouriteRecipes, setFavouriteRecipes] = useState(undefined)
  const [randomCocktail1, setRandomCocktail1] = useState(undefined)
  const [randomCocktail2, setRandomCocktail2] = useState(undefined)

  useFocusEffect(
    useCallback(() => {
      (async() => {
        setFavouriteRecipes(await getFavourites());
      })();
    },[])
  )

  useEffect(() => {
    console.log("favourites are: " + JSON.stringify(favouriteRecipes))
  }, [favouriteRecipes])

  async function getRandomCocktailFromApi(signal){
    try{
      //below for simulating network delay - REMOVE BEFORE SUBMISSION
       const response = await fetch('https://deelay.me/100/https://www.thecocktaildb.com/api/json/v1/1/random.php',{
    //const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`,{
        signal: signal,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      })
      let json = await response.json();
      return json
    } catch (e) {
      console.log(`MainScreen: useEffect fetch encountered an error -> ${e}`);
    }
  }

  useEffect(async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    let json = await getRandomCocktailFromApi(signal);
    //for the first 3 attemps don't show drinks that are already in the recipe book
    while (await isInRecipeBook(json["drinks"][0]["idDrink"])){
      json = await getRandomCocktailFromApi();
    }
    setRandomCocktail1(json["drinks"][0]);
    return () => abortController.abort();
  },[]);

  useEffect(async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    let json = await getRandomCocktailFromApi(signal);
    //for the first 3 attemps don't show drinks that are already in the recipe book
    let count = 0;
    while (await isInRecipeBook(json["drinks"][0]["idDrink"])){
      count++
      if(count < 3){
        json = await getRandomCocktailFromApi();
      }
    }
    setRandomCocktail2(json["drinks"][0])
    return () => abortController.abort();
  },[]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Searchbar
          style={styles.searchbar}
          placeholder={"Search"}
          onChangeText={text => setSearchText(text)}
          value={searchText}
          onSubmitEditing={() => navigation.navigate("SearchScreen", {searchText})}
        />
        {randomCocktail1 ?
          randomCocktail2 ?
            <View style={styles.suggestedCocktailsCardContainer}>
              <SuggestedCocktails
                suggestedCocktails={[randomCocktail1,randomCocktail2]}
                navigation={navigation}
              />
              style={{height:20, width: 20}}
            style={{height:50, width: 50}}
            </View>
          : null
        : null}
        {favouriteRecipes ?
          favouriteRecipes["drinks"].length === 0 ?
            null
          :
            <View style={styles.favouriteCocktailsCardContainer}>
              <FavouritesList
                style={styles.favouriteList}
                favourites={favouriteRecipes}
                navigation={navigation}
                style={{height:50, width: 50}}
              />
            </View>
         :
         null}
        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "2.5%",
    paddingBottom: "2.5%",
    paddingLeft: "2.5%",
    paddingRight: "2.5%",
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 1,
  },
  searchbar: {
    height: "10%",
    backgroundColor: "#bbb",
    maxHeight: "10%",
    flexShrink: 1,
  },
  suggestedCocktailsCardContainer: {
    height: "35%",
    marginTop: 10,
    borderWidth: 1,
    backgroundColor: '#bff',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  favouriteCocktailsCardContainer: {
    height: "55%",
    marginTop: 10,
    borderWidth: 1,
    backgroundColor: '#bff',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  }
});
