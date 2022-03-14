import { useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import {StyleSheet, View, Image, Text, TouchableHighlight, Animated, PanResponder } from 'react-native';

export function CocktailTile(props){
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState
        return !(Math.abs(dx) < 1 && Math.abs(dy) < 1)
      },
      onPanResponderGrant: () => {
        pan.setValue({
          x: 0,
          y: 0
        });
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        })
      },
      onPanResponderMove: Animated.event(
        [
          null,
          {dx: pan.x, dy: pan.y}
        ],
        {useNativeDriver: false}
      ),
      onPanResponderRelease: () => {
        Animated.spring(
          pan,
          {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }
        ).start();
        pan.flattenOffset();
      },
      //return the tile to its original position if the scroll view captures
      //the panresponder. Otherwise the tile can get stuck and 'float' in an
      //odd screen positon.
      onPanResponderTerminate: () => {
        Animated.spring(
          pan,
          {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }
        ).start();
        pan.flattenOffset();
      },
    })
  ).current;

  return(
    <Animated.View
      style={{
        transform:[{translateX: pan.x}, {translateY: pan.y}],
        height: 100,
        width: 100
      }}
      {...panResponder.panHandlers}
    >
      <TouchableHighlight
        style={styles.tile}
        onPress={props.onPress}
      >
        <View style={{width: 100, height: 100}}>
          <Image
            style={styles.tileImage}
            source={{uri:props.image}}
            defaultSource={require("./assets/cocktail-shaker.png")}
          />
          <Text
            style={styles.tileTitle}
          >
            {props.title}
          </Text>
        </View>
      </TouchableHighlight>
    </Animated.View>
  );
}

const styles = StyleSheet.create({

  tile: {
    height: "100%",
    width: "100%",
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
