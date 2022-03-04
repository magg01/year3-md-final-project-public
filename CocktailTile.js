import React from 'react';
import {StyleSheet, Image, Text, TouchableOpacity} from 'react-native';

export default function CocktailTile(props){
  return(
    <TouchableOpacity
      style={styles.tile}
      onPress={props.onPress}
    >
      <Image
        style={styles.tileImage}
        source={{uri:props.image}}
      />
      <Text
        style={styles.tileTitle}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    height: 100,
    width: 100,
    borderRadius: 5,
    backgroundColor: 'gray',
  },
  tileImage: {
    height: "100%",
    width: "100%",
    borderRadius: 5
  },
  tileTitle: {
    position: 'absolute',
    color: 'white'
  }
})
