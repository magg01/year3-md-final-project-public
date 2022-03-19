import { useEffect, useState, useCallback} from 'react';
import { StyleSheet, View, ScrollView, Text, InteractionManager } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
import { TableView, Section } from 'react-native-tableview-simple';
import { FontAwesome } from '@expo/vector-icons';
import { getOrCreateShoppingList, clearBought } from './ShoppingList';
import { RemoveBoughtFromShoppingListButton } from './HeaderButtons';
import { LoadingAnimation } from './LoadingAnimation';
import { IngredientCell } from './IngredientCell';

export function ScreenShoppingList({navigation, route}){
  const [currentShoppingList, setCurrentShoppingList] = useState(undefined);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(async() => {
        if(currentShoppingList === undefined){
          setCurrentShoppingList(await getOrCreateShoppingList());
        }
      })

      return () => task.cancel();
    }, [])
  );

  useEffect(() => {
    if(currentShoppingList != undefined && Object.keys(currentShoppingList).length != 0){
      navigation.setOptions({
        headerRight: () => (
          <RemoveBoughtFromShoppingListButton
            style={{paddingRight: 10}}
            onPress={async () => {
              await clearBought()
              setCurrentShoppingList(await getOrCreateShoppingList());
            }}
          />
        )
      })
    } else {
      navigation.setOptions({
        headerRight: null
      })
    }
  }, [currentShoppingList])

  if(currentShoppingList === undefined){
    return (
      <LoadingAnimation
        loadingMessage="Fetching shopping list"
        style={{width: 200, height: 200}}
      />
    )
  } else if(Object.keys(currentShoppingList).length === 0 ) {
    return (
      <View style={styles.container}>
        <FontAwesome name="shopping-basket" size={50} color="black" />
        <Text>
          { "\n" }
          Your shopping list is empty
        </Text>
      </View>
    )
  } else {
    return(
      //change to flat list
      <ScrollView>
        <TableView>
          {Object.keys(currentShoppingList).map((recipe) => (
            <Section key={recipe} header={recipe}>
              {Object.keys(currentShoppingList[recipe].ingredients).map((ingredient) => (
                <IngredientCell
                  key={recipe + ":" + ingredient}
                  recipe={recipe}
                  ingredient={ingredient}
                  measure={currentShoppingList[recipe]["ingredients"][ingredient].measure}
                  isBought={currentShoppingList[recipe]["ingredients"][ingredient].isBought}
                />
              ))}
            </Section>
          ))}
        </TableView>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
