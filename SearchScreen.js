import { useState, useEffect, useRef} from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Animated } from 'react-native';
import { CocktailTile } from './CocktailTile';
import { LoadingAnimation } from './LoadingAnimation'
import { isInRecipeBook } from './RecipeBook'

export function SearchScreen({navigation, route}) {
  const [searchResults, setSearchResults] = useState(undefined);
  const abortController = new AbortController();
  const signal = abortController.signal;
  const bucket = useRef(new Animated.ValueXY({x:1, y:1})).current;

  useEffect(() => {
    (async () => {
      try{
        //below for simulating network delay - REMOVE BEFORE SUBMISSION
        const response = await fetch(`https://deelay.me/100/https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${route.params.searchText}`,{
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
              bucket={bucket}
              onPress={async () => {
                if(await isInRecipeBook(drink["idDrink"])) {
                  navigation.navigate("RecipeBookScreenStack", {screen: "CocktailDetailRecipeBook", params:{drinkId: drink["idDrink"]}})
                } else {
                  navigation.navigate("CocktailDetailApi", {drinkId: drink["idDrink"]})
                }
              }}
            />
          ))}
        </ScrollView>
        <Animated.View style={{
          position: 'absolute',
          top: 620,
          left: -100,
          transform: [
            {scaleX: bucket.x.interpolate({
              inputRange: [0, 400],
              outputRange: [1.5, 0]
            })},
            {translateY: bucket.y.interpolate({
              inputRange: [0, 800],
              outputRange: [0, -50]
            })}
          ]
        }}>
          <View style={{width: 200, height: 200, borderRadius: 100, backgroundColor: 'red'}}>
          </View>
        </Animated.View>
        <Animated.View style={{
          position: 'absolute',
          top: 620,
          right: -100,
          transform: [
            {scaleX: bucket.x.interpolate({
              inputRange: [0, 400],
              outputRange: [0, 1.5]
            })},
            {translateY: bucket.y.interpolate({
              inputRange: [0, 800],
              outputRange: [0, -50]
            })}
          ]
        }}>
          <View style={{width: 200, height: 200, borderRadius: 100, backgroundColor: 'green'}}>
          </View>
        </Animated.View>
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
