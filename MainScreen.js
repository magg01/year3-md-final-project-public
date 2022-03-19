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
    setRandomCocktail1(json["drinks"][0]);
    return () => abortController.abort();
  },[]);

  useEffect(async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    let json = await getRandomCocktailFromApi(signal);
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
        <View style={styles.suggestedCocktailsCardContainer}>
        {randomCocktail1 ?
          randomCocktail2 ?
              <SuggestedCocktails
                suggestedCocktails={[randomCocktail1,randomCocktail2]}
                navigation={navigation}
              />
          : <LoadingAnimation
              loadingMessage={"fetching suggestions"}
              style={{height:20, width: 20}}
            />
        : <LoadingAnimation
            loadingMessage={"fetching suggestions"}
            style={{height:50, width: 50}}
          />
        }
        </View>

        <View style={styles.favouriteCocktailsCardContainer}>
          <View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                Favourite cocktails
              </Text>
            </View>
            {favouriteRecipes ?
              favouriteRecipes["drinks"].length === 0 ?
                <Text style={styles.noFavouritesText}>Add favourites from your recipe book to see them appear here</Text>
              : <FavouritesList
                  favourites={favouriteRecipes}
                  navigation={navigation}
                />
            : <LoadingAnimation
                loadingMessage={"fetching favourites"}
                style={{height:50, width: 50}}
              />
            }
          </View>
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
    backgroundColor: '#aaa',
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
    borderWidth: 1,
    backgroundColor: '#bff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 1,
  },
  favouriteCocktailsCardContainer: {
    flex: 5.5,
    marginTop: 10,
    borderWidth: 1,
    backgroundColor: '#bff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 1,
  },
  headerContainer: {
    flex: 1,
    borderWidth: 1,
    minWidth: "100%",
    maxHeight: "10%",
    backgroundColor: '#acd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    textAlignVertical: 'center',
    alignSelf: 'flex-start',
  },
  noFavouritesText: {
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
