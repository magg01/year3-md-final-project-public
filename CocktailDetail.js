import React from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';

export function CocktailDetail({navigation, route}){
  return(
    <View>
      <Text>
        {route.params.drink["strDrink"]}
      </Text>
      <Image
        style={styles.tileImage}
        source={{uri:route.params.drink["strDrinkThumb"]}}
      />
      <Text>
        {route.params.drink["strAlcoholic"]}
        {"\n"}
        Glass: {route.params.drink["strGlass"]}
        {"\n"}
        Instructions: {route.params.drink["strInstructions"]}

      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    height: 200,
    width: 200,
    borderRadius: 5,
    backgroundColor: 'gray',
  },
  tileImage: {
    height: 200,
    width: 200,
    borderRadius: 5
  },
  tileTitle: {
    position: 'absolute',
    color: 'white'
  }
})
