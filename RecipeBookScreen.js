import { useState, useCallback, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Text, Animated, Dimensions} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { CocktailTile } from './CocktailTile';
import { getAllRecipes } from './RecipeBook';

export function RecipeBookScreen({navigation}){
  const [recipeBook, setRecipeBook] = useState(undefined);
  const bucket = useRef(new Animated.ValueXY({x:1, y:1})).current;
  const {height, width} = Dimensions.get('window')
  const rightThird = width / 3 * 2
  const leftThird = width / 3
  const bottomTenth = height / 10 * 9;
  const inRightZoneSwitch = useRef(false);
  const vibratedRight = useRef(false);
  const inLeftZoneSwitch = useRef(false);
  const vibratedLeft = useRef(false);

  const listener = bucket.addListener((value) => {
    if(value.x > rightThird && value.y > bottomTenth){
      inRightZone()
    } else {
      outRightZone()
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

  //useFocusEffect from navigation library so that the recipe book is updated
  //when navigating BACK to the recipe book page as well as simply to the page.
  useFocusEffect(
    //have to wrap the callback in useCallback so that the effect only runs
    //on initial render or if one of the depencies changes i.e. RecipeBook
    //and not on every render if the screen has focus.
    useCallback(() => {
      const updateContentsOfBook = async () => {
        try {
          const results = await getAllRecipes();
          setRecipeBook(results);
        } catch (e){
          console.log("RecipeBookScreen::useFocusEffect encountered an error -> " + e);
        }
      }
      updateContentsOfBook();
    }, [])
  );

  if(recipeBook === undefined){
    return (
      <Text>
        add loading indicator
      </Text>
    )
  } else if (recipeBook.drinks.length === 0){
    return (
      <View style={styles.container}>
        <MaterialIcons name="import-contacts" size={50} color="black" />
        <Text>
          { "\n" }
          Your recipe book is empty
        </Text>
      </View>
    )
  } else if (recipeBook === "error"){
    return (
      <Text>
        There was an error retrieving your recipe book.
      </Text>
    )
  } else {
    return (
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ paddingBottom: 1000 }}>
          {recipeBook.drinks.map((drink) => (
            <CocktailTile
              key={drink["idDrink"]}
              drink={drink}
              image={drink["strDrinkThumb"]}
              moveable={true}
              bucket={bucket}
              inShoppingListZone={inRightZoneSwitch}
              inRecipeBookZone={inLeftZoneSwitch}
              onPress={() => {navigation.navigate("CocktailDetailRecipeBook", {drinkId: drink["idDrink"] })}}
            />
          ))}
        </ScrollView>
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
          <View style={{backgroundColor:'#694fad', width: 200, height: 200, borderRadius: 100, opacity: 0.8}}>
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
});
