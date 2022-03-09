import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Button, Alert} from 'react-native';
import { isInRecipeBook, saveToRecipeBook, updateRecipe, saveImageToFile, getUriForSavedImageFile, removeSavedImageFromFile, removeFromRecipeBook, confirmRecipeRemoval} from './RecipeBook';
import { ButtonAddRemoveToFromRecipeBook } from './ButtonAddRemoveToFromRecipeBook.js';
import { Ionicons } from '@expo/vector-icons';

export function CocktailDetailRecipeBook({navigation, route}){
  const [notesText, setNotesText] = useState(undefined);

  useEffect(() => setHeaderOptions());

  const saveNotes = async () => {
    let drink = route.params.drink
    drink["strNotes"] = notesText
    updateRecipe(drink);
  }

  const removeDrink = async (id) => {
    await removeFromRecipeBook(id);
    navigation.goBack();
    removeSavedImageFromFile(id)
  }

  const setHeaderOptions = () => {
    navigation.setOptions(
      {headerRight: () => (
        <ButtonAddRemoveToFromRecipeBook
          style={{paddingRight: 10}}
          onPress={async () =>
            await confirmRecipeRemoval() ? removeDrink(route.params.drink["idDrink"]) : null}
          mode="remove"
        />
      )}
    )
  }

  return(
    <View>
      <Image
        style={styles.tileImage}
        source={{uri:getUriForSavedImageFile(route.params.drink["idDrink"])}}
      />
      <Text>
        {route.params.drink["strAlcoholic"]}
        {"\n"}
        Glass: {route.params.drink["strGlass"]}
        {"\n"}
        Instructions: {route.params.drink["strInstructions"]}
      </Text>
      <TextInput
        placeholder="Notes"
        onChangeText={text => setNotesText(text)}
        defaultValue={route.params.drink["strNotes"]}
        onBlur={() => saveNotes()}
      />
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
