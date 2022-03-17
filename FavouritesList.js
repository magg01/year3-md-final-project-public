import { ScrollView, StyleSheet, View } from 'react-native';
import { CocktailTile } from './CocktailTile';

export function FavouritesList(props) {
  return (
    <View style={styles.container}>
      <ScrollView>
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
        </ScrollView>
      </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
