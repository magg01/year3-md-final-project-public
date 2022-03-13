import { useState, useCallback } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Text} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { CocktailTile } from './CocktailTile';
import { getAllRecipes } from './RecipeBook';



export function RecipeBookScreen({navigation}){
  const [recipeBook, setRecipeBook] = useState(undefined);

  //useFocusEffect from navigation library so that the recipe book is updated
  //when navigating BACK to the recipe book page as well as simply to the page.
  useFocusEffect(
    //have to wrap the callback in useCallback so that the effect only runs
    //on initial render or if one of the depencies changes i.e. RecipeBook
    //and not on every render if the screen has focus.
    useCallback(() => {
      const updateContentsOfBook = async () => {
        try {
          const results = await getAllRecipes();
          setRecipeBook(results);
        } catch (e){
          console.log("RecipeBookScreen::useFocusEffect encountered an error -> " + e);
        }
      }
      updateContentsOfBook();
    }, [])
  );

  if(recipeBook === undefined){
    return (
      <Text>
        add loading indicator
      </Text>
    )
  } else if (recipeBook.drinks.length === 0){
    return (
      <View style={styles.container}>
        <MaterialIcons name="import-contacts" size={50} color="black" />
        <Text>
          { "\n" }
          Your shopping list is empty
        </Text>
      </View>
    )
  } else if (recipeBook === "error"){
    return (
      <Text>
        There was an error retrieving your recipe book.
      </Text>
    )
  } else {
    return (
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ paddingBottom: 1000 }}>
          {recipeBook.drinks.map((drink) => (
            <CocktailTile
              key={drink["idDrink"]}
              title={drink["strDrink"]}
              image={drink["strDrinkThumb"]}
              onPress={() => {navigation.navigate("CocktailDetailRecipeBook", {drinkId: drink["idDrink"] })}}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
