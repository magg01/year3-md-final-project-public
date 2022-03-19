import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import { saveToRecipeBook, saveApiImageToFile } from './RecipeBook';
import { addToShoppingList } from './ShoppingList';
import { AddRemoveToFromRecipeBookButton, AddToShoppingListButton } from './HeaderButtons';
import { LoadingAnimation } from './LoadingAnimation';

export function CocktailDetailApi({navigation, route}){
  const [currentDrink, setCurrentDrink] = useState(undefined);
  const abortController = new AbortController();
  const signal = abortController.signal;

  useEffect(() => {
    if(currentDrink === undefined){
      (async () => {
        try{
          const response = await fetch(`https://deelay.me/100/https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${route.params.drinkId}`,{
            signal: signal,
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }
          })
          const json = await response.json();
          setCurrentDrink(json["drinks"][0]);
        } catch (e) {
          console.log(`CocktailDetailApi: useEffect fetch encountered an error -> ${e}`);
        }
      })();
    }
    return () => abortController.abort();
  }, [])

  useEffect(() => {
    if(currentDrink != undefined){
      navigation.setOptions(
        {
          title: currentDrink["strDrink"],
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              <AddRemoveToFromRecipeBookButton
                style={{paddingRight: 10}}
                onPress={() => saveDrink()}
                mode="add"
              />
              <AddToShoppingListButton
                style={{paddingRight: 10}}
                onPress={() => {
                  console.log("From recipe book detail screen, adding " + currentDrink["strDrink"] + " to shopping list");
                  addToShoppingList(currentDrink)
                }}
              />
            </View>
          )
        }
      )
    }
  }, [currentDrink])

  const saveDrink = async () => {
    if(currentDrink != undefined){
      try{
        await saveToRecipeBook(currentDrink);
        navigation.goBack();
        saveApiImageToFile(currentDrink);
      } catch {
        console.log("saveDrink: encountered an error -> " + e);
      }
    }
  }

  if(currentDrink === undefined){
    return(
      <LoadingAnimation
        loadingMessage="Fetching drink..."
        style={{width: 200, height: 200}}
      />
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
