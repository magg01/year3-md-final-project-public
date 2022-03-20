import { useEffect, useState, useCallback } from 'react';
import {StyleSheet, View, Image, Text, TextInput} from 'react-native';
import {
  getFromRecipeBook,
  updateRecipe,
  removeDrink,
  confirmRecipeRemoval,
  addToFavourties,
  removeFromFavourties} from './RecipeBook';
import { useFocusEffect } from '@react-navigation/native'
import { addToShoppingList } from './ShoppingList';
import { LoadingAnimation } from './LoadingAnimation';
import { CustomNavigationBar } from './CustomNavigationBar';

export function CocktailDetailRecipeBook({navigation, route}){
  const [notesText, setNotesText] = useState(undefined);
  const [currentDrink, setCurrentDrink] = useState(undefined);
  const [currentImageUri, setCurrentImageUri] = useState(undefined);
  const [isDrinkFavourite, setIsDrinkFavourite] = useState(undefined);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await setCurrentDrink(await getFromRecipeBook(route.params.drinkId));
      })()
    },[route.params.drinkId])
  );

  useEffect(() => {
    if(currentDrink != undefined){
      setCurrentImageUri(currentDrink["strDrinkThumb"]);
      setIsDrinkFavourite(currentDrink["favourite"]);
    }
  }, [currentDrink])

  async function recipeRemovalConfirmed(){
    await removeDrink(currentDrink["idDrink"])
    navigation.goBack()
  }

  useEffect(() => {
    if(currentDrink != undefined){
      navigation.setOptions({
        headerTitle: currentDrink["strDrink"],
        header: (props) => {
          return (
            <CustomNavigationBar
              drink={currentDrink}
              screenName={"CocktailDetailRecipeBookScreen"}
              addRemoveToFromFavouritesAction={isDrinkFavourite}
              changeFavouriteState={(isFavourite) => setIsDrinkFavourite(isFavourite)}
              {...props}
            />
          )
        }
      })
    }
  }, [currentDrink, isDrinkFavourite])

  async function saveNotes(){
    let drink = currentDrink;
    drink["strNotes"] = notesText;
    updateRecipe(drink);
    setCurrentDrink(drink);
  }

  if(currentDrink === undefined){
    return (
      <LoadingAnimation
        loadingMessage="fetching drink"
        style={{width: 200, height: 200}}
      />
    )
  } else {
    return(
      <View>
        <Image
          style={styles.tileImage}
          source={{uri: route.params.newImageUri ? route.params.newImageUri : currentImageUri}}
        />
        <Text>
          {currentDrink["strAlcoholic"]}
          {"\n"}
          Glass: {currentDrink["strGlass"]}
          {"\n"}
          Instructions: {currentDrink["strInstructions"]}
        </Text>
        <TextInput
          placeholder="Notes"
          onChangeText={text => setNotesText(text)}
          defaultValue={currentDrink["strNotes"]}
          onBlur={() => saveNotes()}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  tile: {
    height: 200,
    width: 200,
    borderRadius: 5,
    backgroundColor: 'gray',
  },
  tileImage: {
    height: 200,
    width: 200,
    borderRadius: 5
  },
  tileTitle: {
    position: 'absolute',
    color: 'white'
  }
})
