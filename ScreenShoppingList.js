import React, {useEffect, useState} from 'react';
import { ScrollView } from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { getOrCreateShoppingList, setShoppingList } from './ShoppingList';
import { LoadingAnimation } from './LoadingAnimation';

export function ScreenShoppingList({navigation, route}){
  const [currentShoppingList, setCurrentShoppingList] = useState(undefined);

  useEffect(async()=> {
    setCurrentShoppingList(await getOrCreateShoppingList());
  }, [])

  useEffect(() => {
    console.log(currentShoppingList);
  }, [currentShoppingList]);

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
          {currentShoppingList.recipes.map((recipe) => (
            <Section header={recipe["strDrink"]}>
            </Section>
          ))}
        </TableView>
      </ScrollView>
    )
  }
}
