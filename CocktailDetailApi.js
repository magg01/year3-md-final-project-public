import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Button, Alert} from 'react-native';
import { getFromRecipeBook, isInRecipeBook, saveToRecipeBook, removeButtonPressedConfirmResult, removeFromRecipeBook, updateRecipe, saveImageToFile, getUriForSavedImageFile, removeSavedImageFromFile, removedButtonPressed} from './RecipeBook';
import { ButtonAddRemoveToFromRecipeBook } from './ButtonAddRemoveToFromRecipeBook';

export function CocktailDetailApi({navigation, route}){
  const [currentDrinkInRecipeBook, setCurrentDrinkInRecipeBook] = useState(undefined);
  const [currentDrink, setCurrentDrink] = useState(undefined);

  useEffect(() => {
    (async () => {
      setCurrentDrinkInRecipeBook(await isInRecipeBook(route.params.drinkId));
    })()
  }, []);

  useEffect(() => {
    (async () => {
      if(currentDrinkInRecipeBook != undefined){
        if(currentDrinkInRecipeBook){
          setCurrentDrink(getFromRecipeBook(route.params.drinkId))
        } else {
          const response = await fetch(`https://deelay.me/2000/https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${route.params.drinkId}`,{
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }
          })
          const json = await response.json();
          setCurrentDrink(json["drinks"][0]);
        }
      }
    })();
  }, [currentDrinkInRecipeBook])

  useEffect(() => {
    if(currentDrink != undefined){
      navigation.setOptions(
        {
          title: currentDrink["strDrink"],
          headerRight: () => (
            <ButtonAddRemoveToFromRecipeBook
              style={{paddingRight: 10}}
              onPress={() => saveDrink()}
              mode="add"
            />
          )
        }
      )
    }
  }, [currentDrink])

  const setHeaderOptions = async() => {

  }

  const saveDrink = async () => {
    if(currentDrink != undefined){
      await saveToRecipeBook(currentDrink);
      navigation.goBack();
      saveImageToFile(currentDrink);
    }
  }

  const removeDrink = async (id) => {
    await removeFromRecipeBook(id)
    navigation.goBack();
    removeSavedImageFromFile(id)
  }

  if(currentDrink === undefined){
    return(
      <Text>
        fetching drink...
      </Text>
    )
  } else {
    return(
      <View>
        <Image
          style={styles.tileImage}
          source={{uri: currentDrink["strDrinkThumb"]}}
          loadingIndicatorSource={require("./assets/cocktail-shaker.png")}
        />
        <Text>
          {currentDrink["strAlcoholic"]}
          {"\n"}
          Glass: {currentDrink["strGlass"]}
          {"\n"}
          Instructions: {currentDrink["strInstructions"]}
        </Text>
      </View>
    );
  }
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
