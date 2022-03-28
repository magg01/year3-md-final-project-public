import React, { useState } from 'react';
import { Cell } from 'react-native-tableview-simple';
import { updateIsBoughtForIngredient } from './ShoppingList';

export function IngredientCell(props){
  const [isBought, setIsBought] = useState(props.isBought);

  return (
    <Cell
      titleTextStyle={isBought ? {textDecorationLine: 'line-through'} : {textDecorationLine: 'none'}}
      key={props.key}
      title={props.ingredient}
      cellStyle={"RightDetail"}
      detail={props.measure}
      detailTextStyle={isBought ? {textDecorationLine: 'line-through'} : {textDecorationLine: 'none'}}
      onPress={async () => {
        await updateIsBoughtForIngredient(props.recipe, props.ingredient, !isBought)
        await setIsBought(!isBought)
      }}
    />
  )
}
