import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Button, Alert} from 'react-native';
import { isInRecipeBook, saveToRecipeBook, removeButtonPressedConfirmResult, removeFromRecipeBook, updateRecipe, saveImageToFile, getUriForSavedImageFile, removeSavedImageFromFile, removedButtonPressed} from './RecipeBook';
import { Ionicons } from '@expo/vector-icons';

export function CocktailDetailApi({navigation, route}){
  const [currentDrinkInRecipeBook, setCurrentDrinkInRecipeBook] = useState(undefined);

  useEffect(() => {
    (async () => {
      setCurrentDrinkInRecipeBook(await isInRecipeBook(route.params.drink["idDrink"]));
      setHeaderOptions();
    })()
  }, [currentDrinkInRecipeBook]);

  const saveDrink = async () => {
    await saveToRecipeBook(route.params.drink);
    navigation.goBack();
    saveImageToFile(route.params.drink);
  }

  const removeDrink = async (id) => {
    await removeFromRecipeBook(id)
    navigation.goBack();
    removeSavedImageFromFile(id)
  }

  const setHeaderOptions = () => {
    if (currentDrinkInRecipeBook) {
      navigation.setOptions(
        {headerRight: () => (
          <TouchableOpacity
            style={{paddingRight: 10}}
            onPress={async () =>
              await confirmRecipeRemoval() ? removeDrink(route.params.drink["idDrink"]) : null
            }
          >
            <Ionicons name="book-outline" size={28}/>
            <Ionicons name="remove-circle-outline" size={14} style={{position: 'absolute', paddingTop:6, paddingLeft:13}}/>
          </TouchableOpacity>
        )}
      )
    } else {
      navigation.setOptions(
        {headerRight: () => (
          <TouchableOpacity
            style={{paddingRight: 10}}
            onPress={() => saveDrink()}
          >
            <Ionicons name="book-outline" size={28}/>
            <Ionicons name="add-circle-outline" size={14} style={{position: 'absolute', paddingTop:6, paddingLeft:13}}/>
          </TouchableOpacity>
        )}
      )
    }
  }

  return(
    <View>
      <Image
        style={styles.tileImage}
        source={{uri: route.params.drink["strDrinkThumb"]}}
        loadingIndicatorSource={require("./assets/cocktail-shaker.png")}
      />
      <Text>
        {route.params.drink["strAlcoholic"]}
        {"\n"}
        Glass: {route.params.drink["strGlass"]}
        {"\n"}
        Instructions: {route.params.drink["strInstructions"]}
      </Text>
    </View>
  );
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
