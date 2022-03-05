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
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
    console.log("fetchFromRecipeBook: error encountered ->" + e);
    alert("An error occured");
  }
}

async function getAllRecipes(){
  let recipes = [];
  try{
    return new Promise((resolve, reject) => {
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
          reject("error");
          console.log("getAllRecipes: error occured -> " + e);
          alert("An error occurred retreiving your recipe book");
        }
      });
    });
  } catch (e) {
    console.log("getAllRecipes: an error occurred -> " + e);
  }
}

export { saveToRecipeBook, getFromRecipeBook, getAllRecipes };
