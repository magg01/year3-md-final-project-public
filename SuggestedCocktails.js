import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, FlatList  } from 'react-native';
import { Title, IconButton, useTheme } from 'react-native-paper';
import { CocktailTile } from './CocktailTile';

export function SuggestedCocktails(props){
  const data = props.suggestedCocktails
  const { colors } = useTheme();

  //render a cocktail tile to the flatlist
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

  //return the view
  return (
    <View style={[styles.drinkContainer, {backgroundColor: colors.suggestedCocktailCard}]}>
      <FlatList
        style={{width: "100%"}}
        horizontal={true}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
        data={data}
        renderItem={renderCocktailTile}
        keyExtractor={item => item.idDrink}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  drinkContainer: {
    flex: 5,
    padding: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
})
