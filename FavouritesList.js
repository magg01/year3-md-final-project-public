import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { CocktailTile } from './CocktailTile';

export function FavouritesList(props) {
  return (
    <View>
      <View>
        <Text>
          Favourites
        </Text>
      </View>
        <View>
            {props.favourites.drinks.map((drink) => (
              <CocktailTile
                key={drink["idDrink"]}
                drink={drink}
                moveable={false}
                image={drink["strDrinkThumb"]}
                onPress={async () => {
                  props.navigation.navigate("RecipeBookScreenStack", {screen: "CocktailDetailRecipeBook", params:{drinkId: drink["idDrink"]}})
                }}
              />
            ))}
          </View>
      </View>
  )
}


const styles = StyleSheet.create({
  outerContainer:{
    flex: 4,
    marginTop: 10,
    borderWidth: 1,
    backgroundColor: '#bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
