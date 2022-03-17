import { ScrollView } from 'react-native';
import { CocktailTile } from './CocktailTile';

export function FavouritesList(props) {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 1000 }}>
      {props.favourites.drinks.map((drink) => (
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
