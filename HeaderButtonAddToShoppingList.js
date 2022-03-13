import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addToShoppingList } from './ShoppingList';

export function HeaderButtonAddToShoppingList(props){
  return (
    <TouchableOpacity
      style={props.style}
      onPress = {() => {
        console.log("From recipe book detail screen, adding " + props.drink["strDrink"] + " to shopping list");
        addToShoppingList(props.drink)
      }}
    >
      <Ionicons name="cart-outline" size={28} />
    </TouchableOpacity>
  )
}
