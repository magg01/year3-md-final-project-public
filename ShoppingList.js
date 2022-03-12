import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import { Alert } from 'react-native';

import {shoppingListKey, ingredientListKeysFromApi} from './Constants';

async function getOrCreateShoppingList(){
  try{
    let shoppingList = await AsyncStorage.getItem(shoppingListKey);
    if(shoppingList === null){
      let emptyShoppingList = {}
      setShoppingList(emptyShoppingList)
      console.log("getOrCreateShoppingList: returning " + JSON.stringify(emptyShoppingList))
      return emptyShoppingList
    } else {
      console.log("getOrCreateShoppingList: returning " + JSON.stringify(shoppingList));
      return JSON.parse(shoppingList);
    }
  } catch (e){
    console.log("getOrCreateShoppingList: encountered an error -> " + e);
  }
}

async function setShoppingList(shoppingList){
  await AsyncStorage.removeItem(shoppingListKey);
  AsyncStorage.setItem(shoppingListKey, JSON.stringify(shoppingList));
}

async function addToShoppingList(recipe){
  try{
    let list = await getOrCreateShoppingList();
    if(list[recipe.strDrink]){
      Alert.alert(null, recipe.strDrink + " ingredients are already on your shopping list.");
    } else {
      let recipeShoppingDetails = {ingredients: [], isBought: false}
      for (let key in ingredientListKeysFromApi){
        if(recipe[ingredientListKeysFromApi[key]] === null){
          break
        } else {
          recipeShoppingDetails.ingredients.push(recipe[ingredientListKeysFromApi[key]])
        }
      }
      list[recipe.strDrink] = recipeShoppingDetails
      setShoppingList(list);
      Toast.show(recipe.strDrink + " ingredients were added to your shopping list", {duration: Toast.durations.SHORT});
    }
  } catch (e) {
    console.log("addToShoppingList: encountered an error -> " + e);
    alert('couldn\'t add to shopping list')
  }
}

export {
  shoppingListKey,
  getOrCreateShoppingList,
  setShoppingList,
  addToShoppingList,
}
