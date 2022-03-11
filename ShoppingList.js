import AsyncStorage from '@react-native-async-storage/async-storage';
import {shoppingListKey} from './Constants';

async function getOrCreateShoppingList(){
  try{
    let shoppingList = await AsyncStorage.getItem(shoppingListKey);
    if(shoppingList === null){
      let emptyShoppingList = {recipes: []}
      setShoppingList(emptyShoppingList)
      return emptyShoppingList
    } else {
      return JSON.parse(shoppingList);
    }
  } catch (e){
    console.log("getOrCreateShoppingList: encountered an error -> " + e);
  }
}

async function setShoppingList(shoppingList){
  AsyncStorage.setItem(shoppingListKey, JSON.stringify(shoppingList));
}

async function addToShoppingList(recipe){
  let list = await getOrCreateShoppingList();
  list[recipes][recipe["idDrink"]] = recipe;
  setShoppingList(list);
}

export {
  shoppingListKey,
  getOrCreateShoppingList,
  setShoppingList,
  addToShoppingList,
}
