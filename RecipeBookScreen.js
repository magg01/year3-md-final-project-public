import { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, Text, Animated, Dimensions} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LoadingAnimation } from './LoadingAnimation';
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
  const { colors } = useTheme();

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

  const renderCocktailTile = ({item}) => {
    return (
      <CocktailTile
        key={item.idDrink}
        drink={item}
        moveable={false}
        image={item.strDrinkThumb}
        moveable={true}
        bucket={bucket}
        inShoppingListZone={inRightZoneSwitch}
        inRecipeBookZone={inLeftZoneSwitch}
        onPress={async () => {
          navigation.navigate("RecipeBookScreenStack", {screen: "CocktailDetailRecipeBook", params:{drinkId: item.idDrink}})
        }}
      />
    )
  }

  if(recipeBook === undefined){
    return (
      <LoadingAnimation
        loadingMessage="Opening recipe book"
        style={{width: 200, height: 200}}
      />
    );
  } else if (recipeBook.drinks.length === 0){
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <MaterialIcons name="import-contacts" size={50} color="black" />
          <Text>
            { "\n" }
            Your recipe book is empty
          </Text>
        </View>
      </SafeAreaView>
    )
  } else if (recipeBook === "error"){
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <MaterialIcons name="error-outline" size={50} color="black" />
          <Text>
            { "\n" }
            There was an error retreiving your recipe book
          </Text>
        </View>
      </SafeAreaView>
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
          data={recipeBook.drinks}
          renderItem={renderCocktailTile}
          keyExtractor={item => item.idDrink}
          numColumns={2}
        />
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
