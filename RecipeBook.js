import AsyncStorage from '@react-native-async-storage/async-storage';

async function isInRecipeBook(id){
  let exists;
  try{
    exists = await AsyncStorage.getItem(id)
    return exists === null ? false : true
  } catch (e) {
    console.log("isInRecipeBook: an error occurred -> " + e)
  }
}

async function saveToRecipeBook(drink) {
  let exists;
  try {
    exists = await AsyncStorage.getItem(drink["idDrink"]);
  } catch (e) {
    console.log(e);
    alert("Error " +drink["strDrink"] + " could not be saved.")
  }
  if (exists === null){
    try {
      await AsyncStorage.setItem(drink["idDrink"], JSON.stringify(drink));
      console.log("Saved " + drink["strDrink"] + " successfully with key " + drink["idDrink"]);
      alert(drink["strDrink"] + " was saved to recipe book.");
    } catch (e) {
      alert("Error " +drink["strDrink"] + " could not be saved.")
      console.log(e);
    }
  } else {
    alert(drink["strDrink"] + " is already in your recipe book.");
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
    AsyncStorage.removeItem(id);
    console.log('removed drink with id=' + id + " from recipe book")
    alert('This drink was removed from your recipe book');
  } catch (e) {
    console.log("removeFromRecipeBook: an error occured -> " + e)
    alert('couldn\'t remove this drink from your recipe book')
  }
}

export { isInRecipeBook, saveToRecipeBook, getFromRecipeBook, getAllRecipes, removeFromRecipeBook };
