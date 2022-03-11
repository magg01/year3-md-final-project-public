import { useState } from 'react';
import { Cell } from 'react-native-tableview-simple';

export function IngredientCell(props){
  const [isBought, setIsBought] = useState(false);

  return (
    <Cell
      titleTextStyle={isBought ? {textDecorationLine: 'line-through'} : {textDecorationLine: 'none'}}
      key={props.ingredient}
      title={props.ingredient}
      onPress={() => setIsBought(!isBought)}
    />
  )
}
