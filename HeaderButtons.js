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
      <MaterialIcons name="photo-camera" size={28} color="black" />
    </TouchableOpacity>
  )
}

export function RemoveBoughtFromShoppingListButton(props){
  return (
    <TouchableOpacity
      style={props.style}
      onPress = {props.onPress}
    >
      <Ionicons name="trash-bin-outline" size={28} />
    </TouchableOpacity>
  )
}

export function AddRemoveToFromRecipeBookButton(props){
  if(props.mode === "add"){
    return(
      <TouchableOpacity
        style={props.style}
        onPress={props.onPress}
      >
        <Ionicons name="book-outline" size={28}/>
        <Ionicons name="add-circle-outline" size={14} style={{position: 'absolute', paddingTop:6, paddingLeft:13}}/>
      </TouchableOpacity>
    );
  } else if (props.mode === "remove") {
    return(
      <TouchableOpacity
        style={props.style}
        onPress={props.onPress}
      >
        <Ionicons name="book-outline" size={28}/>
        <Ionicons name="remove-circle-outline" size={14} style={{position: 'absolute', paddingTop:6, paddingLeft:13}}/>
      </TouchableOpacity>
    );
  } else {
    return(
      <TouchableOpacity
        style={props.style}
        onPress={props.onPress}
      >
        <Ionicons name="book-outline" size={28}/>
      </TouchableOpacity>
    );
  }
}
