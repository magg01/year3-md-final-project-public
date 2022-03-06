import React, { useState, useEffect } from 'react';
import {StyleSheet, SafeAreaView, ScrollView, Text} from 'react-native';
import CocktailTile from './CocktailTile';
import { getAllRecipes } from './RecipeBook';


export function RecipeBookScreen({navigation, route}){
  const [recipeBook, setRecipeBook] = useState(undefined);

  useEffect(() => {
    if (recipeBook === undefined){
      (async() => {
        let returnedRecipes = await getAllRecipes();
        console.log("returned recipes are " + JSON.stringify(returnedRecipes));
        setRecipeBook(returnedRecipes);
      })();
    }
  }, [recipeBook]);

  if(recipeBook === undefined){
    return (
      <Text>
        add loading indicator
      </Text>
    )
  } else if (recipeBook === []){
    return (
      <Text>
        hmm... no recipes
      </Text>
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
              image={drink["strDrinkThumb"]+"/preview"}
              onPress={() => {navigation.navigate("CocktailDetail", {drink})}}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

})
