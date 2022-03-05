import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveToRecipeBook(drink) {
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

export async function getFromRecipeBook(id){
  try {
    const jsonValue = await AsyncStorage.getItem(id);
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
    console.log("fetchFromRecipeBook: error encountered ->" + e);
    alert("An error occured");
  }
}
