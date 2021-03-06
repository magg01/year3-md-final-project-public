import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import { Alert } from 'react-native';
import {shoppingListKey, ingredientListKeysFromApi, measureListKeysFromApi} from './Constants';

//fetch the shopping list from storage or create a new blank list if it doesn't exist
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

//set the shopping list in storage
async function setShoppingList(shoppingList){
  await AsyncStorage.removeItem(shoppingListKey);
  AsyncStorage.setItem(shoppingListKey, JSON.stringify(shoppingList));
}

//add a recipe to the shopping list
async function addToShoppingList(recipe){
  try{
    let list = await getOrCreateShoppingList();
    if(list[recipe.strDrink]){
      Alert.alert(null, recipe.strDrink + " ingredients are already on your shopping list.");
    } else {
      let recipeShoppingDetails = {ingredients: {}}
      for (let key in ingredientListKeysFromApi){
        if(recipe[ingredientListKeysFromApi[key]] === null){
          break
        } else {
          if(recipe[ingredientListKeysFromApi[key]].trim() != "")
          recipeShoppingDetails.ingredients[recipe[ingredientListKeysFromApi[key]]] = {isBought: false, measure: recipe[measureListKeysFromApi[key]]}
        }
      }
      list[recipe.strDrink] = recipeShoppingDetails
      console.log("addToShoppingList, list is now: " + JSON.stringify(list))
      setShoppingList(list);
      Toast.show("Ingredients for " + recipe.strDrink + " were added to your shopping list", {duration: Toast.durations.SHORT});
    }
  } catch (e) {
    console.log("addToShoppingList: encountered an error -> " + e);
    alert('couldn\'t add to shopping list')
  }
}

//update the isBought property for an ingredient in the shopping list
async function updateIsBoughtForIngredient(recipe, ingredient, isBought){
  try{
    let list = await getOrCreateShoppingList();
    if (list[recipe]){
      if(list[recipe]["ingredients"][ingredient]){
        list[recipe]["ingredients"][ingredient]["isBought"] = isBought;
      } else {
        Alert.alert(null, "This ingredient was not found on the shopping list");
      }
    } else {
      Alert.alert(null, "This recipe was not found on the shopping list");
    }
    await setShoppingList(list);
  } catch (e) {
    console.log("updateIsBoughtForIngredient: encountered an error -> " + e)
  }
}

//clear the items from the shopping list whose isBought property is true
async function clearBought(){
  let list = await getOrCreateShoppingList()
  Object.keys(list).map((recipe) => (
    Object.keys(list[recipe].ingredients).map((ingredient) =>(
      list[recipe].ingredients[ingredient].isBought
      ?
      delete list[recipe].ingredients[ingredient]
      :
      null
    )),
    Object.keys(list[recipe].ingredients).length === 0
    ?
    delete list[recipe]
    :
    null
  ))
  await setShoppingList(list);
}

//export shopping list functions
export {
  shoppingListKey,
  getOrCreateShoppingList,
  setShoppingList,
  addToShoppingList,
  updateIsBoughtForIngredient,
  clearBought,
}
