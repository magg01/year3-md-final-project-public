import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export function AddToShoppingListButton(props){
  return (
    <TouchableOpacity
      style={props.style}
      onPress = {props.onPress}
    >
      <MaterialIcons name="add-shopping-cart" size={28} color="black" />
    </TouchableOpacity>
  )
}

export function CaptureDrinkImageButton(props){
  return (
    <TouchableOpacity
      style={props.style}
      onPress={props.onPress}
    >
      <MaterialIcons name="photo-camera" size={26} color="black" />
    </TouchableOpacity>
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
      <TouchableOpacity
        style={props.style}
        onPress={props.onPress}
      >
        <MaterialIcons  name="star" size={26} color="black" />
      </TouchableOpacity>
    )
  } else {
    return(
      <TouchableOpacity
        style={props.style}
        onPress={props.onPress}
      >
        <MaterialIcons  name="star-border" size={26} color="black" />
      </TouchableOpacity>
    )
  }
}

export function AddRemoveToFromRecipeBookButton(props){
  if(props.mode === "add"){
    return(
      <TouchableOpacity
        style={props.style}
        onPress={props.onPress}
      >
        <Ionicons name="book-outline" size={26}/>
        <Ionicons name="add-circle-outline" size={12} style={{position: 'absolute', paddingTop:6, paddingLeft:12}}/>
      </TouchableOpacity>
    );
  } else if (props.mode === "remove") {
    return(
      <TouchableOpacity
        style={props.style}
        onPress={props.onPress}
      >
        <Ionicons name="book-outline" size={26}/>
        <Ionicons name="remove-circle-outline" size={12} style={{position: 'absolute', paddingTop:6, paddingLeft:12}}/>
      </TouchableOpacity>
    );
  } else {
    return(
      <TouchableOpacity
        style={props.style}
        onPress={props.onPress}
      >
        <Ionicons name="book-outline" size={26}/>
      </TouchableOpacity>
    );
  }
}
