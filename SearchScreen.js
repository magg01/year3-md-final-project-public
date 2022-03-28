import React, { useState, useEffect, useRef} from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Animated, Vibration, Dimensions, FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { CocktailTile } from './CocktailTile';
import { LoadingAnimation } from './LoadingAnimation';
import { isInRecipeBook } from './RecipeBook';
import { useTheme } from 'react-native-paper';

export function SearchScreen({navigation, route}) {
  const [searchResults, setSearchResults] = useState(undefined);
  const abortController = new AbortController();
  const signal = abortController.signal;
  const bucket = useRef(new Animated.ValueXY({x:1, y:1})).current;
  const {height, width} = Dimensions.get('window')
  //zone thresholds for the vibration effect
  const rightThird = width / 3 * 2
  const leftThird = width / 3
  const bottomTenth = height / 10 * 9;
  const inRightZoneSwitch = useRef(false);
  const vibratedRight = useRef(false);
  const inLeftZoneSwitch = useRef(false);
  const vibratedLeft = useRef(false);
  const { colors } = useTheme();

  //listen to the 'bucket' animated value to listen for the screen posiiton
  //of a cocktail tile under gesture. Trigger events when the gesture enters
  //the respective zones
  const listener = bucket.addListener((value) => {
    if(value.x > rightThird && value.y > bottomTenth){
      inRightZone()
    } else {
      outRightZone()
    }
    if(value.x < leftThird && value.y > bottomTenth){
      inLeftZone()
    } else {
      outLeftZone()
    }
  });

  function inRightZone(){
    inRightZoneSwitch.current = true
    if(!vibratedRight.current){
      Haptics.impactAsync("light");
      vibratedRight.current = true
    }
  }

  function outRightZone(){
    if(inRightZoneSwitch){
      inRightZoneSwitch.current = false
    }
    if(vibratedRight){
      vibratedRight.current = false
    }
  }

  function inLeftZone(){
    inLeftZoneSwitch.current = true
    if(inLeftZoneSwitch && !vibratedLeft.current){
      Haptics.impactAsync("light");
      vibratedLeft.current = true
    }
  }

  function outLeftZone(){
    if(inLeftZoneSwitch){
      inLeftZoneSwitch.current = false
    }
    if(vibratedLeft){
      vibratedLeft.current = false
    }
  }

  //get the search results from the api.
  useEffect(() => {
    (async () => {
      try{
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${route.params.searchText}`,{
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
    //Abort the fetch request in the case that the component is no longer mounted
    return () => abortController.abort();
  },[]);

  //render a cocktailTile to the flatlist of results
  const renderCocktailTile = ({item}) => {
    return (
      <CocktailTile
        key={item.idDrink}
        drink={item}
        moveable={true}
        image={item.strDrinkThumb}
        moveable={true}
        bucket={bucket}
        inShoppingListZone={inRightZoneSwitch}
        inRecipeBookZone={inLeftZoneSwitch}
        onPress={async () => {
          if(await isInRecipeBook(item["idDrink"])) {
            navigation.navigate("RecipeBookScreenStack", {screen: "CocktailDetailRecipeBook", initial: false, params:{drinkId: item["idDrink"]}})
          } else {
            navigation.navigate("MainScreenStack", {screen: "CocktailDetailApi", params: {drinkId: item["idDrink"]}})
          }
        }}
      />
    )
  }

  //conditionally render the search screen based on the results returned from the API
  if (searchResults === undefined){
    return (
      <LoadingAnimation
        loadingMessage="mixing results"
        style={{width: 200, height: 200}}
      />
    );
  } else  if (searchResults.drinks === null){
    return (
      <View style={styles.container}>
        <MaterialIcons name="no-drinks" size={50} color="black" />
        <Text>
          { "\n" }
          No results found
        </Text>
      </View>
    )
  } else {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
        <FlatList
          // need to ensure flatlist expands to bottom of screen even if there's
          // not enough data to fill it, otherwise animated cocktail tiles
          // are not visible when moved beyond the extent of the flatlist container
          contentContainerStyle={{flexGrow: 1}}
          style={{width: "100%"}}
          data={searchResults.drinks}
          renderItem={renderCocktailTile}
          keyExtractor={item => item.idDrink}
          numColumns={2}
        />
        <Animated.View style={{
          position: 'absolute',
          bottom: - width / 3,
          left: 0 - width / 6,
          transform: [
            {scaleX: bucket.x.interpolate({
              inputRange: [0, 400],
              outputRange: [3, 0]
            })},
            {translateY: bucket.y.interpolate({
              inputRange: [0, 800],
              outputRange: [0, -50]
            })}
          ]
        }}>
          <View style={{backgroundColor: colors.primary, width: width / 3, height: width / 3, borderRadius: width /6, opacity: 0.8}}>
          </View>
        </Animated.View>
        <Animated.View style={{
          position: 'absolute',
          bottom: -width / 3,
          right:  0 - width / 6,
          transform: [
            {scaleX: bucket.x.interpolate({
              inputRange: [0, 400],
              outputRange: [0, 3]
            })},
            {translateY: bucket.y.interpolate({
              inputRange: [0, 800],
              outputRange: [0, -50]
            })}
          ]
        }}>
          <View style={{backgroundColor: colors.primary, width: width / 3, height: width / 3, borderRadius: width /6, opacity: 0.8}}>
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
