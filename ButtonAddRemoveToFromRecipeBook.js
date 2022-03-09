import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ButtonAddRemoveToFromRecipeBook(props){
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
