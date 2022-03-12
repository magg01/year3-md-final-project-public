import React, {useEffect, useState} from 'react';
import { ScrollView, Text } from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { getOrCreateShoppingList, setShoppingList } from './ShoppingList';
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
    console.log("ScreenShoppingList: currentShoppingList is: " + JSON.stringify(currentShoppingList));
  },[currentShoppingList])

  if(currentShoppingList === undefined){
    return (
      <LoadingAnimation
        loadingMessage="Fetching shopping list"
      />
    )
  } else if(JSON.stringify(currentShoppingList) === "{}" ) {
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
