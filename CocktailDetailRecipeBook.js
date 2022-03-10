import React, { useEffect, useState, useLayoutEffect } from 'react';
import {StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Button, Alert} from 'react-native';
import { getFromRecipeBook, isInRecipeBook, saveToRecipeBook, updateRecipe, saveImageToFile, getUriForSavedImageFile, removeSavedImageFromFile, removeFromRecipeBook, confirmRecipeRemoval} from './RecipeBook';
import { ButtonAddRemoveToFromRecipeBook } from './ButtonAddRemoveToFromRecipeBook.js';
import { Ionicons } from '@expo/vector-icons';

export function CocktailDetailRecipeBook({navigation, route}){
  const [notesText, setNotesText] = useState(undefined);
  const [currentDrink, setCurrentDrink] = useState(undefined);

  useEffect(() => {
    (async () => {
      setCurrentDrink(await getFromRecipeBook(route.params.drinkId));
    })();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: currentDrink === undefined ? '' : currentDrink["strDrink"],
      headerRight: () => (
        <ButtonAddRemoveToFromRecipeBook
          style={{paddingRight: 10}}
          onPress={async () =>
            await confirmRecipeRemoval() ? removeDrink(route.params.drinkId) : null}
          mode="remove"
        />
      )
    })
  });

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
          source={{uri:getUriForSavedImageFile(route.params.drinkId)}}
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
