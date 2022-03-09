import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Button} from 'react-native';
import { isInRecipeBook, saveToRecipeBook, removeFromRecipeBook, updateRecipe, saveImageToFile, getUriForSavedImageFile, removeSavedImageFromFile} from './RecipeBook';
import { Ionicons } from '@expo/vector-icons';

export function CocktailDetailRecipeBook({navigation, route}){
  const [notesText, setNotesText] = useState(undefined);

  useEffect(() => setHeaderOptions());

  const saveNotes = async () => {
    let drink = route.params.drink
    drink["strNotes"] = notesText
    updateRecipe(drink);
  }

  const removeDrink = async () => {
    await removeFromRecipeBook(route.params.drink["idDrink"]);
    navigation.goBack();
    removeSavedImageFromFile(route.params.drink["idDrink"])
  }

  const setHeaderOptions = () => {
    navigation.setOptions(
      {headerRight: () => (
        <TouchableOpacity
          style={{paddingRight: 10}}
          onPress={() => removeDrink()}
        >
          <Ionicons name="book-outline" size={28}/>
          <Ionicons name="remove-circle-outline" size={14} style={{position: 'absolute', paddingTop:6, paddingLeft:13}}/>
        </TouchableOpacity>
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
