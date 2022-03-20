import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { Searchbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, TextInput, View, Button, ScrollView, Text } from 'react-native';
import { CocktailTile } from './CocktailTile';
import { FavouritesList } from './FavouritesList';
import { SuggestedCocktails } from './SuggestedCocktails';
import { LoadingAnimation } from './LoadingAnimation';
import { getFavourites, isInRecipeBook } from './RecipeBook';

export function MainScreen({navigation}) {
  const [searchText, setSearchText] = useState('');
  const [favouriteRecipes, setFavouriteRecipes] = useState(undefined)
  const [randomCocktail1, setRandomCocktail1] = useState(undefined)
  const [randomCocktail2, setRandomCocktail2] = useState(undefined)
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async() => {
        setFavouriteRecipes(await getFavourites());
      })();
    },[])
  )

  useEffect(async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    let json = await getRandomCocktailFromApi(signal);
    setRandomCocktail1(json["drinks"][0]);
    return () => abortController.abort();
  },[shouldRefresh]);

  useEffect(async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    let json = await getRandomCocktailFromApi(signal);
    setRandomCocktail2(json["drinks"][0])
    return () => abortController.abort();
  },[shouldRefresh]);

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

  function refreshSuggestions(){
    setShouldRefresh(!shouldRefresh)
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Searchbar
          style={styles.searchbar}
          placeholder={"Search"}
          onChangeText={text => setSearchText(text)}
          value={searchText}
          onSubmitEditing={() => navigation.navigate("MainScreenStack", {screen: "SearchScreen", params: {searchText: searchText}})}
        />
        <View style={styles.suggestedCocktailsCardContainer}>
          {(randomCocktail1 && randomCocktail2) ?
            <SuggestedCocktails
              suggestedCocktails={[randomCocktail1,randomCocktail2]}
              navigation={navigation}
              refreshSuggestions={() => refreshSuggestions()}
            />
          :
            <LoadingAnimation
              loadingMessage={"fetching suggestions"}
              style={{width: 50, height: 50}}
            />
          }
        </View>
        <View style={styles.favouriteCocktailsCardContainer}>
          {favouriteRecipes ?
            <FavouritesList
              favourites={favouriteRecipes}
              navigation={navigation}
            />
          :
            <LoadingAnimation
              loadingMessage={"fetching favourites"}
              style={{height:50, width: 50}}
            />
          }
        </View>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 1,
  },
  searchbar: {
    flex: 1,
    backgroundColor: "#bbb",
    maxHeight: "10%",
    flexShrink: 1,
  },
  suggestedCocktailsCardContainer: {
    flex: 3.5,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#bff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 1,
  },
  favouriteCocktailsCardContainer: {
    flex: 5.5,
    marginTop: 10,
    backgroundColor: '#bff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 1,
  },
});
