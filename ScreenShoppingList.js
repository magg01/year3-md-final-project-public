import React, {useEffect, useState} from 'react';
import { ScrollView } from 'react-native';
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
  } else {
    return(
      //change to flat list
      <ScrollView>
        <TableView>
          {Object.keys(currentShoppingList).map((key) => (
            <Section key={key} header={key}>
              {currentShoppingList[key].map((ingredient) => (
                  <IngredientCell
                    ingredient={ingredient}
                  />
              ))}
            </Section>
          ))}
        </TableView>
      </ScrollView>
    )
  }
}
