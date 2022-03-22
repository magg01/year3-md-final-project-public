import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { Searchbar, IconButton, Text, Surface } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, TextInput, View, Button, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { CocktailTile } from './CocktailTile';
import { FavouritesList } from './FavouritesList';
import { SuggestedCocktails } from './SuggestedCocktails';
import { LoadingAnimation } from './LoadingAnimation';
import { getFavourites, isInRecipeBook } from './RecipeBook';
import { useTheme } from 'react-native-paper';

export function MainScreen({navigation}) {
  const [searchText, setSearchText] = useState('');
  const [favouriteRecipes, setFavouriteRecipes] = useState(undefined)
  const [randomCocktail1, setRandomCocktail1] = useState(undefined)
  const [randomCocktail2, setRandomCocktail2] = useState(undefined)
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      (async() => {
        setFavouriteRecipes(await getFavourites());
      })();
    },[])
  )

  //check the returned cocktails are not the same one otherwise refresh
  useEffect(() => {
    if(randomCocktail1 && randomCocktail2){
      if(randomCocktail1.idDrink == randomCocktail2.idDrink)
      refreshSuggestions();
    }
  },[randomCocktail1, randomCocktail2])

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

  async function refreshSuggestions(){
    await setRandomCocktail1(undefined)
    await setRandomCocktail2(undefined)
    setShouldRefresh(!shouldRefresh)
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <SafeAreaView>
        <Searchbar
          style={styles.searchbar}
          placeholder={"Search"}
          onChangeText={text => setSearchText(text)}
          value={searchText}
          onSubmitEditing={() => navigation.navigate("MainScreenStack", {screen: "SearchScreen", params: {searchText: searchText}})}
        />
        <Surface style={styles.suggestedCocktailsCardContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Suggested cocktails</Text>
            <IconButton
              style={styles.suggestedRefreshButton}
              icon="refresh"
              size={20}
              onPress={() => refreshSuggestions()}
            />
          </View>
          {(randomCocktail1 && randomCocktail2) ?
            <SuggestedCocktails
              suggestedCocktails={[randomCocktail1,randomCocktail2]}
              navigation={navigation}
            />
          :
            <View style={{flex: 5}}>
              <LoadingAnimation
                loadingMessage={"fetching suggestions"}
                style={{width: 50, height: 50}}
              />
            </View>
          }
        </Surface>
        <Surface style={styles.favouriteCocktailsCardContainer}>
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
        </Surface>
        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "2.5%",
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 1,
  },
  searchbar: {
    flex: 1,
    maxHeight: "10%",
    flexShrink: 1,
  },
  suggestedCocktailsCardContainer: {
    flex: 3.5,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 1,
    elevation: 4,
  },
  favouriteCocktailsCardContainer: {
    flex: 5.5,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 1,
    elevation: 4,
  },
  headerContainer: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minWidth: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    alignSelf: 'flex-start',
    paddingLeft: 10
  },
  suggestedRefreshButton: {
    position: 'absolute',
    alignSelf: 'flex-end'
  },
});
