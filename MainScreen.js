import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, TextInput, View, Button, ScrollView } from 'react-native';
import { CocktailTile } from './CocktailTile';
import { getFavourites } from './RecipeBook';

export function MainScreen({navigation}) {
  const [searchText, setSearchText] = useState('');
  const [favouriteRecipes, setFavouriteRecipes] = useState(undefined)

  useFocusEffect(
    useCallback(() => {
      (async() => {
        setFavouriteRecipes(await getFavourites());
      })();
    },[])
  )

  useEffect(() => {
    console.log("favourites are: " + JSON.stringify(favouriteRecipes))
  }, [favouriteRecipes])

  const FavouritesList = () => {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 1000 }}>
        {favouriteRecipes.drinks.map((drink) => (
          <CocktailTile
            key={drink["idDrink"]}
            drink={drink}
            moveable={false}
            image={drink["strDrinkThumb"]}
            onPress={async () => {
              navigation.navigate("RecipeBookScreenStack", {screen: "CocktailDetailRecipeBook", params:{drinkId: drink["idDrink"]}})
            }}
          />
        ))}
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          onChangeText={text => setSearchText(text)}
          defaultValue={searchText}
        />
        <Button
          title="Search"
          accessibilityLabel="Search for cocktails"
          onPress={() => navigation.navigate("SearchScreen", {searchText})}
        />
        {favouriteRecipes ? favouriteRecipes["drinks"].length === 0 ? null : <FavouritesList/> : null}

        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar:{
    height: 50,
    width: 200,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'black',
  }

});
