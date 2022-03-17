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
import { AddToShoppingListButton,
  AddRemoveToFromRecipeBookButton,
  CaptureDrinkImageButton,
  AddRemoveToFromFavourites } from './HeaderButtons';

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
        title: currentDrink["strDrink"],
        headerRight: () => (
          <View style={{ flexDirection: 'row'}}>
            <AddRemoveToFromRecipeBookButton
              style={{paddingRight: 10}}
              onPress={async () =>
                await confirmRecipeRemoval()
                ?
                  recipeRemovalConfirmed()
                :
                  null
              }
              mode="remove"
            />
            <CaptureDrinkImageButton
              style={{paddingRight: 10}}
              onPress = {() => navigation.navigate("ScreenCameraAddImage", {drinkId: route.params.drinkId})}
            />
            <AddToShoppingListButton
              style={{paddingRight: 10}}
              onPress={() => {
                console.log("From recipe book detail screen, adding " + currentDrink["strDrink"] + " to shopping list");
                addToShoppingList(currentDrink)
              }}
            />
            <AddRemoveToFromFavourites
              style={{paddingRight: 10}}
              favourite={isDrinkFavourite}
              onPress={() => {
                if(isDrinkFavourite){
                  setIsDrinkFavourite(false)
                  removeFromFavourties(currentDrink["idDrink"])
                } else {
                  setIsDrinkFavourite(true)
                  addToFavourties(currentDrink["idDrink"])
                }
              }}
            />
          </View>
        )
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
