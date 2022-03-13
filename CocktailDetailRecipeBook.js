import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import {StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Button, Alert} from 'react-native';
import { getFromRecipeBook, isInRecipeBook, saveToRecipeBook, updateRecipe, saveImageToFile, getUriForSavedImageFile, removeDrink, confirmRecipeRemoval} from './RecipeBook';
import { addToShoppingList } from './ShoppingList';
import { AddToShoppingListButton, AddRemoveToFromRecipeBookButton } from './HeaderButtons';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export function CocktailDetailRecipeBook({navigation, route}){
  const [notesText, setNotesText] = useState(undefined);
  const [currentDrink, setCurrentDrink] = useState(undefined);
  const [currentImageUri, setCurrentImageUri] = useState(undefined);

  useEffect(() => {
    (async () => {
      setCurrentDrink(await getFromRecipeBook(route.params.drinkId));
    })();
  }, []);

  useEffect(() => {
    if(currentDrink != undefined){
      setCurrentImageUri(currentDrink["strDrinkThumb"]);
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
            <TouchableOpacity
              style={{paddingRight: 10}}
              onPress = {() => navigation.navigate("ScreenCameraAddImage", {drinkId: route.params.drinkId})}
            >
              <Ionicons name="camera-outline" size={28} />
            </TouchableOpacity>
            <AddToShoppingListButton
              style={{paddingRight: 10}}
              drink={currentDrink}
            />
          </View>
        )
      })
    }
  }, [currentDrink])

  async function saveNotes(){
    let drink = currentDrink;
    drink["strNotes"] = notesText;
    updateRecipe(drink);
    setCurrentDrink(drink);
  }

if(currentDrink === undefined){
    return(
      <Text>
        Fetching Drink...
      </Text>
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
        <Text>
          {currentImageUri}
        </Text>
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
