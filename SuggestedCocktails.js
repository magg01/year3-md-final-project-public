import { View, StyleSheet, Text } from 'react-native';
import { CocktailTile } from './CocktailTile';

export function SuggestedCocktails(props){
  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Suggested cocktails
        </Text>
      </View>
      <View style={styles.drinkContainer}>
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
    overflow: 'scroll',
  },
})
