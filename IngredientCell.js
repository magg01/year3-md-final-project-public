import { useState, useEffect } from 'react';
import { Cell } from 'react-native-tableview-simple';
import { updateIsBoughtForIngredient } from './ShoppingList';

export function IngredientCell(props){
  const [isBought, setIsBought] = useState(props.isBought);

  // useEffect(() => {
  //     console.log("recipe is: " + props.recipe)
  //     console.log("ingredient is: " + props.ingredient)
  //     console.log("isBought is: " + props.isBought)
  // })

  return (
    <Cell
      titleTextStyle={isBought ? {textDecorationLine: 'line-through'} : {textDecorationLine: 'none'}}
      key={props.key}
      title={props.ingredient}
      onPress={async () => {
        await updateIsBoughtForIngredient(props.recipe, props.ingredient, !isBought)
        await setIsBought(!isBought)
        console.log("props.recipe is: " + props.recipe + ", props.ingredient is: " + props.ingredient + ", isBought is: " + isBought)
      }}
    />
  )
}
