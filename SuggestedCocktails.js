import { View, StyleSheet } from 'react-native';
import { CocktailTile } from './CocktailTile';

export function SuggestedCocktails(props){
  return (
    <View style={styles.container}>
      <CocktailTile
        key={props.suggestionOne["idDrink"]}
        drink={props.suggestionOne}
        moveable={false}
        image={props.suggestionOne["strDrinkThumb"]}
        onPress={async () => {
          props.navigation.navigate("CocktailDetailApi", {drinkId: props.suggestionOne["idDrink"]})
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

const styles = StyleSheet.create({
  container: {
    
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: "100%",
    flexDirection: "row"
  }
})
