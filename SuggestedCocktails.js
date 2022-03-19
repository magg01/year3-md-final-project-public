import { View, StyleSheet, Text, FlatList  } from 'react-native';
import { CocktailTile } from './CocktailTile';
import { useEffect, useState } from 'react'

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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Suggested cocktails
        </Text>
      </View>
      <View style={styles.drinkContainer}>
        <FlatList
          style={{width: "100%"}}
          horizontal={true}
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          data={data}
          renderItem={renderCocktailTile}
          keyExtractor={item => item.idDrink}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    flex: 5,
    borderWidth: 1,
    padding: 5,
    backgroundColor: '#cde',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
})
