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
          props.navigation.navigate("RecipeBookScreenStack", {screen: "CocktailDetailRecipeBook", initial: false, params:{drinkId: item.idDrink}})
        }}
      />
    )
  }

  if(props.favourites.drinks.length === 0){
    return (
      <View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Favourite cocktails
          </Text>
        </View>
        <Text style={styles.noFavouritesText}>Add favourites from your recipe book to see them appear here</Text>
      </View>
    )
  } else {
    return (
      <View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Favourite cocktails
          </Text>
        </View>
        <View style={styles.drinkContainer}>
          <FlatList
            style={{width: "100%"}}
            data={data}
            renderItem={renderCocktailTile}
            keyExtractor={item => item.idDrink}
            numColumns={2}
          />
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  drinkContainer: {
    flex: 5,
    padding: 5,
    flexDirection: 'column',
    backgroundColor: '#cde',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  noFavouritesText: {
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  headerContainer: {
    flex: 1,
    minWidth: "100%",
    maxHeight: "10%",
    backgroundColor: '#acd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    textAlignVertical: 'center',
    alignSelf: 'flex-start',
  },
})
