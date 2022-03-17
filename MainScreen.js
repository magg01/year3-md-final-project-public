import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, TextInput, View, Button, ScrollView } from 'react-native';
import { CocktailTile } from './CocktailTile';
import { FavouritesList } from './FavouritesList';
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

  const SuggestedCocktails = () => {
    return (
      <View>
        <CocktailTile
          key={randomCocktail1["idDrink"]}
          drink={randomCocktail1}
          moveable={false}
          image={randomCocktail1["strDrinkThumb"]}
          onPress={async () => {
            navigation.navigate("CocktailDetailApi", {drinkId: randomCocktail1["idDrink"]})
          }}
        />
        <CocktailTile
          key={randomCocktail2["idDrink"]}
          drink={randomCocktail2}
          moveable={false}
          image={randomCocktail2["strDrinkThumb"]}
          onPress={async () => {
            navigation.navigate("CocktailDetailApi", {drinkId: randomCocktail2["idDrink"]})
          }}
        />
      </View>
    )
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
          onPress={() => navigation.navigate("SearchScreen", {searchText})}
        />
        {randomCocktail1 ? randomCocktail2 ? <SuggestedCocktails/> : null : null}
        {favouriteRecipes ? favouriteRecipes["drinks"].length === 0 ? null : <FavouritesList favourites={favouriteRecipes}/> : null}
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
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'black',
  }

});
