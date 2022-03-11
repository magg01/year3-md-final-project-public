import AsyncStorage from '@react-native-async-storage/async-storage';
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
  let list = await getOrCreateShoppingList();
  let ingredients = []
  for (key in ingredientListKeysFromApi){
    if(recipe[ingredientListKeysFromApi[key]] === null){
      break
    } else {
      ingredients.push(recipe[ingredientListKeysFromApi[key]])
    }
  }
  list[recipe.strDrink] = ingredients
  setShoppingList(list);
}

export {
  shoppingListKey,
  getOrCreateShoppingList,
  setShoppingList,
  addToShoppingList,
}
