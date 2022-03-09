import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-root-toast';

const saveRecipeSuccessToast = (drinkName) => {
  Toast.show(drinkName + " was added to your recipe book", {duration: Toast.durations.SHORT});
}

async function isInRecipeBook(id){
  try{
    const exists = await AsyncStorage.getItem(id)
    return exists === null ? false : true
  } catch (e) {
    console.log("isInRecipeBook: an error occurred -> " + e)
  }
}

async function saveToRecipeBook(drink) {
  try {
    const exists = await AsyncStorage.getItem(drink["idDrink"]);
    if (exists === null){
      try {
        await AsyncStorage.setItem(drink["idDrink"], JSON.stringify(drink));
        saveRecipeSuccessToast(drink["strDrink"]);
        console.log("Saved " + drink["strDrink"] + " successfully with key " + drink["idDrink"]);
      } catch(e){
        throw(e)
      }
    } else {
      alert(drink["strDrink"] + " is already in your recipe book.");
    }
  } catch (e) {
    console.log("saveToRecipeBook encountered an error -> " + e);
    alert("Error " +drink["strDrink"] + " could not be saved.")
  }
}

async function getFromRecipeBook(id){
  try {
    const jsonValue = await AsyncStorage.getItem(id);
    console.log("getFromRecipeBook: got " + JSON.parse(jsonValue) + " from id " + id)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
    console.log("getFromRecipeBook: error encountered ->" + e);
    alert("An error occured");
  }
}

async function getAllRecipes(){
  try{
    const keys = await AsyncStorage.getAllKeys()
    try {
      const pairs = await AsyncStorage.multiGet(keys)
      const recipes = [];
      pairs.map((pair) => {
        recipes.push(JSON.parse(pair[1]));
      })
      const recipeBook = {};
      recipeBook["drinks"] = recipes;
      return(recipeBook);
    } catch (e) {
      console.log("getAllRecipes: error occured -> " + e);
      return("error");
    }
  } catch (e) {
    console.log("getAllRecipes: an error occurred -> " + e);
    resolve("error");
  }
}

async function removeFromRecipeBook(id){
  try {
    await AsyncStorage.removeItem(id);
    alert("Removed from recipe book.");
    console.log('removed drink with id=' + id + " from recipe book")
  } catch (e) {
    console.log("removeFromRecipeBook: an error occured -> " + e)
    alert('couldn\'t remove this drink from your recipe book')
  }
}

async function updateRecipe(drink){
  try {
    await AsyncStorage.setItem(drink["idDrink"], JSON.stringify(drink));
    console.log("Drink with id " + drink["idDrink"] + " successfully updated");
  } catch (e) {
    console.log("updateRecipe: an error occured -> " + e)
    alert('couldn\'t update this drink in your recipe book')
  }
}

async function saveImageToFile(drink){
  try{
    await FileSystem.downloadAsync(drink["strDrinkThumb"], FileSystem.documentDirectory + drink["idDrink"] + "imgThumb.jpg");
    console.log("saveImageToFile: image for drink " + drink["idDrink"] + " sucessfully saved")
  } catch (e) {
    console.log("saveImageToFile: an error occured -> " + e);
  }
}

async function removeSavedImageFromFile(id){
  try{
    await FileSystem.deleteAsync(FileSystem.documentDirectory + id + "imgThumb.jpg");
    console.log("removeSavedImageFromFile: image for drink " + id + " sucessfully removed")
  } catch (e) {
    console.log("removeSavedImageFromFile: an error occured -> " + e);
  }
}

function getUriForSavedImageFile(id){
  return FileSystem.documentDirectory + id + "imgThumb.jpg";
}

export {
  isInRecipeBook,
  saveToRecipeBook,
  getFromRecipeBook,
  getAllRecipes,
  removeFromRecipeBook,
  updateRecipe,
  saveImageToFile,
  getUriForSavedImageFile,
  removeSavedImageFromFile
}
