import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-root-toast';
import { Alert } from 'react-native';
import { shoppingListKey } from './Constants';

//show the saved recipe success toast
const saveRecipeSuccessToast = (drinkName) => {
  Toast.show(`${drinkName} was added to your recipe book`, {duration: Toast.durations.SHORT});
}

//show the removed recipe success toast
const removeRecipeSuccessToast = () => {
  Toast.show("Recipe removed from your recipe book", {duration: Toast.durations.SHORT});
}

//return true if recipe is in the recipe book, false otherwise
async function isInRecipeBook(id){
  try{
    const exists = await AsyncStorage.getItem(id)
    return exists === null ? false : true
  } catch (e) {
    console.log("isInRecipeBook: an error occurred -> " + e)
  }
}

//save a drink recipe to the recipe book
async function saveToRecipeBook(drink) {
  try {
    const exists = await AsyncStorage.getItem(drink["idDrink"]);
    if (exists === null){
      try {
        drink["favourite"] = false;
        await AsyncStorage.setItem(drink["idDrink"], JSON.stringify(drink));
        saveRecipeSuccessToast(drink["strDrink"]);
        console.log("Saved " + drink["strDrink"] + " successfully with key " + drink["idDrink"]);
      } catch(e){
        throw(e)
      }
    } else {
      Alert.alert(null, drink["strDrink"] + " is already in your recipe book.");
    }
  } catch (e) {
    console.log("saveToRecipeBook encountered an error -> " + e);
    Alert.alert("Error", drink["strDrink"] + " could not be saved.")
  }
}

//get a recipe from the recipe book by id
async function getFromRecipeBook(id){
  try {
    const jsonValue = await AsyncStorage.getItem(id);
    console.log("getFromRecipeBook: got " + JSON.parse(jsonValue) + " from id " + id)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
    console.log("getFromRecipeBook: error encountered ->" + e);
    Alert.alert("Error", "An error occured while retrieving recipes");
  }
}

//get all the recipes from the recipe book
async function getAllRecipes(){
  try{
    const keys = await AsyncStorage.getAllKeys()
    const pairs = await AsyncStorage.multiGet(keys)
    const recipes = [];
    pairs.map((pair) => {
      if(pair[0] != shoppingListKey) {
        recipes.push(JSON.parse(pair[1]));
      }
    })
    const recipeBook = {};
    recipeBook["drinks"] = recipes;
    return(recipeBook);
  } catch (e) {
    console.log("getAllRecipes: an error occurred -> " + e);
    return("error");
  }
}

//confirm recipe removal with the user before proceeding
async function confirmRecipeRemoval(){
  return new Promise ((resolve) => {
    Alert.alert(
      "Are you sure you want to remove this drink?",
      "You will lose any notes and your own image if you've added one.",
      [
        {
          text: "Cancel",
          onPress: () => resolve(false),
          style: "cancel"
        },
        {
          text: "Remove",
          onPress: () => resolve(true),
          style: "destructive"
        }
      ]
    );
  })
}

//confirm photo replacement before proceeding
async function confirmPhotoReplacement(){
  return new Promise((resolve) => {
    Alert.alert(
      "Are you sure you want to keep this image?",
      "You will lose the previous image.",
      [
        {
          text: "Cancel",
          onPress: () => resolve(false),
          style: "cancel"
        },
        {
          text: "Replace",
          onPress: () => resolve(true),
          style: "destructive"
        }
      ]
    );
  })
}

//remove a drink from the recipe book and its saved image from storage
async function removeDrink(id){
  await removeSavedImageFromFile(id)
  await removeDrinkFromRecipeBook(id);
  removeRecipeSuccessToast()
}

//
async function removeDrinkFromRecipeBook(id){
  try {
    await AsyncStorage.removeItem(id);
    console.log('removed drink with id=' + id + " from recipe book");
  } catch (e) {
    console.log("removeFromRecipeBook: an error occured -> " + e);
    Alert.alert("Error", "couldn\'t remove this drink from your recipe book");
  }
}

async function updateRecipe(drink){
  try {
    await AsyncStorage.setItem(drink["idDrink"], JSON.stringify(drink));
    console.log("Drink with id " + drink["idDrink"] + " successfully updated");
  } catch (e) {
    console.log("updateRecipe: an error occured -> " + e)
    Alert.alert("Error", "couldn\'t update this drink in your recipe book")
  }
}

async function saveApiImageToFile(drink){
  try{
    let filepath = FileSystem.documentDirectory + drink["idDrink"] + Date.now() + ".jpg";
    await FileSystem.downloadAsync(drink["strDrinkThumb"], filepath);
    let newDrink = await getFromRecipeBook(drink["idDrink"]);
    newDrink["strDrinkThumb"] = filepath
    updateRecipe(newDrink);
    console.log("saveImageToFile: image for drink " + drink["idDrink"] + " sucessfully saved");
  } catch (e) {
    console.log("saveImageToFile: an error occured -> " + e);
  }
}

async function removeSavedImageFromFile(id){
  try{
    let filepath = (await getFromRecipeBook(id))["strDrinkThumb"]
    await FileSystem.deleteAsync(filepath);
    console.log("removeSavedImageFromFile: image for drink " + id + " sucessfully removed")
  } catch (e) {
    console.log("removeSavedImageFromFile: an error occured -> " + e);
  }
}

async function copyImageFromCache(id, imageCacheUri){
  try{
    let filepath = FileSystem.documentDirectory + id + Date.now() + ".jpg";
    FileSystem.copyAsync({from: imageCacheUri, to: filepath})
    return(filepath);
  } catch (e) {
    console.log("copyImageFromCache: encountered an error -> " + e);
    return(null);
  }
}

async function replaceImageForDrink(id, newImgCacheUri){
  try{
    await removeSavedImageFromFile(id);
    let newPath = await copyImageFromCache(id, newImgCacheUri);
    let drink = await getFromRecipeBook(id);
    drink["strDrinkThumb"] = newPath
    drink["strImageAttribution"] = null
    await updateRecipe(drink);
    return newPath;
  } catch (e) {
    console.log("replaceImageForDrink: encountered an error -> " + e);
  }
}

async function getUriForSavedImageFile(id){
  let recipe = await getFromRecipeBook(id);
  return recipe["strDrinkThumb"];
}

async function addToFavourites(id){
  try {
    let drink = await getFromRecipeBook(id)
    drink["favourite"] = true
    updateRecipe(drink);
  } catch (e) {
    console.log("addToFavourties: encountered an error -> " + e);
  }
}

async function removeFromFavourites(id){
  try {
    let drink = await getFromRecipeBook(id)
    drink["favourite"] = false
    updateRecipe(drink);
  } catch (e) {
    console.log("removeFromFavourties: encountered an error -> " + e);
  }
}

async function getFavourites(){
  try {
    let allRecipes = await getAllRecipes();
    let favourites = []
    allRecipes["drinks"].map((recipe) => (
      recipe["favourite"] ? favourites.push(recipe) : null
    ));
    let favouritesBook = {};
    favouritesBook["drinks"] = favourites;
    return favouritesBook

  } catch (e) {
    console.log("getFavourties: encountered an error -> " + e);
  }
}

export {
  isInRecipeBook,
  saveToRecipeBook,
  getFromRecipeBook,
  getAllRecipes,
  confirmRecipeRemoval,
  removeDrink,
  updateRecipe,
  saveApiImageToFile,
  getUriForSavedImageFile,
  removeSavedImageFromFile,
  replaceImageForDrink,
  copyImageFromCache,
  confirmPhotoReplacement,
  addToFavourites,
  removeFromFavourites,
  getFavourites,
}
