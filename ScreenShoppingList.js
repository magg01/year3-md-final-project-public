import React, {useEffect, useState} from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { Ionicons } from '@expo/vector-icons';
import { getOrCreateShoppingList, setShoppingList, clearBought } from './ShoppingList';
import { LoadingAnimation } from './LoadingAnimation';
import { IngredientCell } from './IngredientCell';

export function ScreenShoppingList({navigation, route}){
  const [currentShoppingList, setCurrentShoppingList] = useState(undefined);

  useEffect(async()=> {
    if(currentShoppingList === undefined){
      setCurrentShoppingList(await getOrCreateShoppingList());
    }
  }, []);

  useEffect(() => {
    if(currentShoppingList != undefined && Object.keys(currentShoppingList).length != 0){
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={{paddingRight: 10}}
            onPress = {async () => {
              await clearBought()
              setCurrentShoppingList(await getOrCreateShoppingList());
            }}
          >
            <Ionicons name="trash-bin-outline" size={28} />
          </TouchableOpacity>
        )
      })
    } else {
      navigation.setOptions({
        headerRight: null
      })
    }
  }, [currentShoppingList])

  useEffect(() => {
    console.log("ScreenShoppingList: currentShoppingList is: " + JSON.stringify(currentShoppingList));
  },[currentShoppingList])

  if(currentShoppingList === undefined){
    return (
      <LoadingAnimation
        loadingMessage="Fetching shopping list"
      />
    )
  } else if(Object.keys(currentShoppingList).length === 0 ) {
    return (
      <Text>
        Your shopping list is empty
      </Text>
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
