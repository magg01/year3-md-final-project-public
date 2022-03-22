import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, FlatList } from 'react-native';
import { Title, Text } from 'react-native-paper';
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

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Favourite cocktails</Text>
      </View>
      <View style={styles.drinkContainer}>
        <FlatList
          ListEmptyComponent={<Text style={styles.noFavouritesText}>Add favourites from your recipe book to see them appear here</Text>}
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


const styles = StyleSheet.create({
  drinkContainer: {
    flex: 5,
    padding: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    flexDirection: 'column',
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    textAlignVertical: 'center',
    alignSelf: 'flex-start',
    paddingLeft: 10
  },
})
