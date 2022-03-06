import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity, Button} from 'react-native';
import { isInRecipeBook, saveToRecipeBook, removeFromRecipeBook } from './RecipeBook';
import { Ionicons } from '@expo/vector-icons';

export function CocktailDetail({navigation, route}){

  const [inRecipeBook, setInRecipeBook] = useState(undefined);

  const setHeaderOptions = () => {
    if (inRecipeBook) {
      navigation.setOptions(
        {headerRight: () => (
          <TouchableOpacity
            style={{paddingRight: 10}}
            onPress={() => removeFromRecipeBook(route.params.drink["idDrink"])
          .then(setInRecipeBook(false))}
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
            onPress={() => saveToRecipeBook(route.params.drink).then(setInRecipeBook(true))}
          >
            <Ionicons name="book-outline" size={28}/>
            <Ionicons name="add-circle-outline" size={14} style={{position: 'absolute', paddingTop:6, paddingLeft:13}}/>
          </TouchableOpacity>
        )}
      )
    }
  }

  useEffect(async () => {
    if (inRecipeBook === undefined){
      let inBook = await isInRecipeBook(route.params.drink["idDrink"]);
      setInRecipeBook(inBook);
      setHeaderOptions();
    } else {
      setHeaderOptions();
    }
  }, [inRecipeBook]);

  return(
    <View>
      <Image
        style={styles.tileImage}
        source={{uri:route.params.drink["strDrinkThumb"]}}
      />
      <Text>
        {route.params.drink["strAlcoholic"]}
        {"\n"}
        Glass: {route.params.drink["strGlass"]}
        {"\n"}
        Instructions: {route.params.drink["strInstructions"]}
      </Text>
      <Button
        title="setHeaderOptions"
        onPress={() => setHeaderOptions()}
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
