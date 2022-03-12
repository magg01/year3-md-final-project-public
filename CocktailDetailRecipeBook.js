import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import {StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Button, Alert} from 'react-native';
import { getFromRecipeBook, isInRecipeBook, saveToRecipeBook, updateRecipe, saveImageToFile, getUriForSavedImageFile, removeSavedImageFromFile, removeFromRecipeBook, confirmRecipeRemoval} from './RecipeBook';
import { addToShoppingList } from './ShoppingList';
import { ButtonAddRemoveToFromRecipeBook } from './ButtonAddRemoveToFromRecipeBook.js';
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

  useEffect(() => {
    if(currentDrink != undefined){
      navigation.setOptions({
        title: currentDrink["strDrink"],
        headerRight: () => (
          <View style={{ flexDirection: 'row'}}>
            <ButtonAddRemoveToFromRecipeBook
              style={{paddingRight: 10}}
              onPress={async () =>
                await confirmRecipeRemoval() ? removeDrink(currentDrink["idDrink"]) : null}
              mode="remove"
            />
            <TouchableOpacity
              style={{paddingRight: 10}}
              onPress = {() => navigation.navigate("ScreenCameraAddImage", {drinkId: route.params.drinkId})}
            >
              <Ionicons name="camera-outline" size={28} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{paddingRight: 10}}
              onPress = {() => {
                console.log("From recipe book detail screen, adding " + currentDrink["strDrink"] + " to shopping list");
                addToShoppingList(currentDrink)
              }}
            >
              <Ionicons name="cart-outline" size={28} />
            </TouchableOpacity>
          </View>
        )
      })
    }
  }, [currentDrink])

  const saveNotes = async () => {
    let drink = currentDrink;
    drink["strNotes"] = notesText;
    updateRecipe(drink);
    setCurrentDrink(drink);
  }

  const removeDrink = async (id) => {
    await removeFromRecipeBook(id);
    navigation.goBack();
    removeSavedImageFromFile(id)
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
