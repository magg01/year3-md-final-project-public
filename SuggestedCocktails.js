import { View, StyleSheet, Text, FlatList } from 'react-native';
import { CocktailTile } from './CocktailTile';
import { useEffect } from 'react'

export function SuggestedCocktails(props){
  const data = props.suggestedCocktails

  const renderCocktailTile = ({item}) => {
    return (
      <CocktailTile
        key={item.idDrink}
        drink={item}
        moveable={false}
        image={item.strDrinkThumb}
        onPress={async () => {
          props.navigation.navigate("MainScreenStack", {screen: "CocktailDetailApi", params:{drinkId: item.idDrink}})
        }}
      />
    )
  }

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Suggested cocktails
        </Text>
      </View>
      <View style={styles.drinkContainer}>
        <FlatList
          data={data}
          renderItem={renderCocktailTile}
          keyExtractor={item => item.idDrink}
          numColumns={2}
        />      
        {/*<CocktailTile
          key={props.suggestedCocktails[0]["idDrink"]}
          drink={props.suggestedCocktails[0]}
          moveable={false}
          image={props.suggestedCocktails[0]["strDrinkThumb"]}
          onPress={async () => {
            props.navigation.navigate("CocktailDetailApi", {drinkId: props.suggestedCocktails[0]["idDrink"]})
          }}
        />
        <CocktailTile
          key={props.suggestedCocktails[1]["idDrink"]}
          drink={props.suggestedCocktails[1]}
          moveable={false}
          image={props.suggestedCocktails[1]["strDrinkThumb"]}
          onPress={async () => {
            props.navigation.navigate("CocktailDetailApi", {drinkId: props.suggestedCocktails[1]["idDrink"]})
          }}
        />*/}
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
    flex: 5,
    borderWidth: 1,
    padding: 5,
    flexDirection: 'row',
    backgroundColor: '#cde',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
