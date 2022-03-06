import AsyncStorage from '@react-native-async-storage/async-storage';

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
  let recipes = [];
  try{
    return new Promise((resolve) => {
      AsyncStorage.getAllKeys()
      .then((keys) => {
        try {
          AsyncStorage.multiGet(keys)
          .then((pairs) => {
            pairs.map((pair) => {
              recipes.push(JSON.parse(pair[1]));
            })
            let recipeBook = {};
            recipeBook["drinks"] = recipes;
            resolve(recipeBook);
          });
        } catch (e) {
          console.log("getAllRecipes: error occured -> " + e);
          resolve("error");
        }
      });
    });
  } catch (e) {
    console.log("getAllRecipes: an error occurred -> " + e);
    resolve("error");
  }
}

export { saveToRecipeBook, getFromRecipeBook, getAllRecipes };
