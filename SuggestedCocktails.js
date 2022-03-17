import { View } from 'react-native';
import { CocktailTile } from './CocktailTile';

export function SuggestedCocktails(props){
  return (
    <View>
      <CocktailTile
        key={props.suggestionOne["idDrink"]}
        drink={props.suggestionOne}
        moveable={false}
        image={props.suggestionOne["strDrinkThumb"]}
        onPress={async () => {
          navigation.navigate("CocktailDetailApi", {drinkId: props.suggestionOne["idDrink"]})
        }}
      />
      <CocktailTile
        key={props.suggestionTwo["idDrink"]}
        drink={props.suggestionTwo}
        moveable={false}
        image={props.suggestionTwo["strDrinkThumb"]}
        onPress={async () => {
          props.navigation.navigate("CocktailDetailApi", {drinkId: props.suggestionTwo["idDrink"]})
        }}
      />
    </View>
  )
}
