import React, { useEffect, useState, useCallback} from 'react';
import { StyleSheet, View, ScrollView, InteractionManager } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native'
import { TableView, Section } from 'react-native-tableview-simple';
import { FontAwesome } from '@expo/vector-icons';
import { getOrCreateShoppingList, clearBought } from './ShoppingList';
import { LoadingAnimation } from './LoadingAnimation';
import { IngredientCell } from './IngredientCell';
import { CustomNavigationBar } from './CustomNavigationBar';

export function ScreenShoppingList({navigation, route}){
  const [currentShoppingList, setCurrentShoppingList] = useState(undefined);
  const {colors} = useTheme();

  //get the current shopping list from storage when the screen comes into view
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

  //set the app header opotions by the state of the shopping list
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Shopping list",
      header: (props) => {
        return (
          <CustomNavigationBar
            screenName={"ShoppingListScreen"}
            updateShoppingListIconButtonVisible={(currentShoppingList != undefined && Object.keys(currentShoppingList).length != 0)}
            shoppingListIconButtonOnPress={updateShoppingList}
            {...props}
          />
        )
      }
    })
  }, [currentShoppingList])

  //update the stored shopping list
  async function updateShoppingList(){
    await clearBought()
    setCurrentShoppingList(await getOrCreateShoppingList());
  }

  //conditionally render based on the shopping list contents
  //not yet found
  if(currentShoppingList === undefined){
    return (
      <LoadingAnimation
        loadingMessage="Fetching shopping list"
        style={{width: 200, height: 200}}
      />
    )
  //empty shopping list
  } else if(Object.keys(currentShoppingList).length === 0 ) {
    return (
      <View style={[styles.container, {backgroundColor: colors.background} ]}>
        <FontAwesome name="shopping-basket" size={50} color="black" />
        <Text>
          { "\n" }
          Your shopping list is empty
        </Text>
      </View>
    )
  //shopping list with items
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
