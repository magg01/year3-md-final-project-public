import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';

export function AddToShoppingListButton(props){
  return (
    <IconButton
      icon="cart-arrow-down"
      color={'black'}
      size={26}
      onPress={props.onPress}
    />
  )
}

export function CaptureDrinkImageButton(props){
  return (
    <IconButton
      icon="camera"
      color={'black'}
      size={26}
      onPress={props.onPress}
    />
  )
}

export function RemoveBoughtFromShoppingListButton(props){
  return (
    <TouchableOpacity
      style={props.style}
      onPress = {props.onPress}
    >
      <MaterialIcons name="delete-sweep" size={26} color="black" />
    </TouchableOpacity>
  )
}

export function AddRemoveToFromFavourites(props){
  if(props.favourite){
    return(
      <IconButton
        icon="star"
        color={'black'}
        size={26}
        onPress={props.onPress}
      />
    )
  } else {
    return(
      <IconButton
        icon="star-outline"
        color={'black'}
        size={26}
        onPress={props.onPress}
      />
    )
  }
}

export function AddRemoveToFromRecipeBookButton(props){
  if(props.mode === "add"){
    return(
      <IconButton
        icon="book-plus"
        color={'black'}
        size={26}
        onPress={props.onPress}
      />
    );
  } else {
    return(
      <IconButton
        icon="book-remove"
        color={'black'}
        size={26}
        onPress={props.onPress}
      />
    );
  }
}
