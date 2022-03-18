import { ScrollView, StyleSheet, View, Text, FlatList } from 'react-native';
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
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Favourite cocktails
        </Text>
      </View>
      <View style={styles.drinkContainer}>
        <FlatList
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
  headerContainer: {
    flex: 1,
    borderWidth: 1,
    minWidth: "100%",
    backgroundColor: '#acd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    alignSelf: 'flex-start',
  },
  drinkContainer: {
    borderWidth: 1,
    flex: 5,
    padding: 5,
    flexDirection: 'row',
    backgroundColor: '#cde',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
