import AsyncStorage from '@react-native-async-storage/async-storage';

const shoppingListFilePath = AsyncStorage.documentDirectory + "shoppingList";

async function getOrCreateShoppingList(){
  try{
    let shoppingList = await AsyncStorage.getItem(shoppingListFilePath);
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
  AsyncStorage.setItem(JSON.stringify(shoppingList), shoppingListFilePath);
}

async function addToShoppingList(recipe){
  let list = await getOrCreateShoppingList();
  list[recipes][recipe["idDrink"]] = recipe;
  setShoppingList(list);
}

export {
  shoppingListFilePath,
  getOrCreateShoppingList,
  setShoppingList,
  addToShoppingList,
}
