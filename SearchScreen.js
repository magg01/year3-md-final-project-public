import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import { SafeAreaView, StyleSheet, Text, Image, View, ScrollView, Animated, Easing } from 'react-native';
import CocktailTile from './CocktailTile';
import { isInRecipeBook } from './RecipeBook'

export function SearchScreen({navigation, route}) {
  const searchText = route.params.searchText;
  const [searchResults, setSearchResults] = useState(undefined);

  const shakerAngle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          shakerAngle,
          {
            toValue:1,
            duration: 400,
            easing: Easing.bezier(0.87, 0, 0.13, 1),
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          shakerAngle,
          {
            toValue:-1,
            duration: 400,
            easing: Easing.bezier(0.87, 0, 0.13, 1),
            useNativeDriver: true,
          }
        )
      ])
    ).start()
  }, []);


  const spin = shakerAngle.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-90deg', '45deg']
  });

  useEffect(() => {
    (async () => {
      try{
        //below for simulating network delay - REMOVE BEFORE SUBMISSION
        const response = await fetch(`https://deelay.me/2000/https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`,{
        //const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`,{
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
  },[]);

  if (searchResults === undefined){
    return (
      <View style={styles.container}>
        <Animated.Image
          style={[{height:200, width:200}, {transform: [{rotate: spin}]}]}
          source={require('./assets/cocktail-shaker.png')}
        />
        <Text>
          { "\n" }
          Mixing results...
        </Text>
      </View>
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
                  navigation.navigate("CocktailDetailRecipeBook", {drink})
                } else {
                  navigation.navigate("CocktailDetailApi", {drink})
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
