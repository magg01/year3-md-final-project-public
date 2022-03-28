import React, { useEffect } from 'react';
import { StyleSheet, Image, View, Button } from 'react-native'
import { Text } from 'react-native-paper';
import { confirmPhotoReplacement, replaceImageForDrink } from './RecipeBook';

export function ScreenReviewCocktailImage({navigation, route}){
  //render the image review screen
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={route.params.image}
      />
      <Text>
        Keep this image?
      </Text>
      <View style={{marginTop: 20}}>
        <Button
          title={"use this image"}
          onPress={() => {
            confirmPhotoReplacement()
            .then((confirmation) => {
              if(confirmation){
                replaceImageForDrink(route.params.drinkId, route.params.image.uri)
                .then(() => navigation.navigate("RecipeBookScreenStack",{screen: "CocktailDetailRecipeBook", params: {drinkId: route.params.drinkId, newImageUri: route.params.image.uri}})
                )
              }
            })
          }}
        />
      </View>
      <View style={{marginTop: 20}}>
        <Button
          style={{marginTop: 20}}
          title={"discard this image"}
          onPress={() => {
            navigation.goBack()
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
  }
})
