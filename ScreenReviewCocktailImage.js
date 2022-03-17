import { useEffect } from 'react';
import { StyleSheet, Image, Text, View, Button } from 'react-native'
import { confirmPhotoReplacement, replaceImageForDrink } from './RecipeBook';

export function ScreenReviewCocktailImage({navigation, route}){
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={route.params.image}
      />
      <Text>
        Keep this image?
      </Text>
      <Button
        title={"use this image"}
        onPress={() => {
          confirmPhotoReplacement()
          .then((confirmation) => {
            if(confirmation){
              replaceImageForDrink(route.params.drinkId, route.params.image.uri)
              navigation.navigate("CocktailDetailRecipeBook",{drinkId: route.params.drinkId, newImageUri: route.params.image.uri})
            }
          })
        }}
      />
      <Button
        title={"discard this image"}
        onPress={() => {
          navigation.goBack()
        }}
      />
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
