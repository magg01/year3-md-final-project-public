import { ScrollView, StyleSheet, View, Text, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { CocktailTile } from './CocktailTile';

export function FavouritesList(props) {
  const data = props.favourites.drinks

  const renderCocktailTile = ({item}) => {
    return (
      <CocktailTile
        key={item.idDrink}
        drink={item}
        moveable={false}
        image={item.strDrinkThumb}
        onPress={async () => {
          props.navigation.navigate("RecipeBookScreenStack", {screen: "CocktailDetailRecipeBook", params:{drinkId: item.idDrink}})
        }}
      />
    )
  }

  return (
      <View style={styles.drinkContainer}>
        <FlatList
          style={{width: "100%"}}
          data={data}
          renderItem={renderCocktailTile}
          keyExtractor={item => item.idDrink}
          numColumns={2}
        />
      </View>
  )
}


const styles = StyleSheet.create({
  drinkContainer: {
    borderWidth: 1,
    flex: 5,
    padding: 5,
    flexDirection: 'column',
    backgroundColor: '#cde',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
