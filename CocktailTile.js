import { useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import {StyleSheet, View, Image, Text, TouchableHighlight, Animated, PanResponder } from 'react-native';
import { saveToRecipeBook } from './RecipeBook';
import { addToShoppingList } from './ShoppingList';

export function CocktailTile(props){
  const pan = props.moveable ? useRef(new Animated.ValueXY()).current : null

  const panResponder = pan === null ? null : useRef(
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
      onPanResponderMove: (e, gestureState) => {
        Animated.event(
          [null,
            {
              dx: pan.x,
              dy: pan.y,
            }
          ],
          {useNativeDriver: false}
        )(e, gestureState)
        Animated.event(
          [null,
            {
              moveX: props.bucket.x,
              moveY: props.bucket.y
            }
          ],
          {useNativeDriver: false}
        )(e, gestureState)
      },
      onPanResponderRelease: () => {
        Animated.spring(
          pan,
          {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }
        ).start();
        pan.flattenOffset();
        Animated.spring(
          props.bucket,
          {
            toValue: {x: 1, y: 1},
            useNativeDriver: true
          }
        ).start()
        checkDropZonePerformAction()
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
        Animated.spring(
          props.bucket,
          {
            toValue: {x: 1, y: 1},
            useNativeDriver: true
          }
        ).start()
      },
    })
  ).current

  function checkDropZonePerformAction(){
    if(props.inRecipeBookZone.current){
      saveToRecipeBook(props.drink)
    } else if (props.inShoppingListZone.current){
      addToShoppingList(props.drink)
    }
  }

  if(props.moveable){
    return(
      <View style={styles.cocktailTile}>
        <Animated.View
          style={{
            transform:[{translateX: pan.x}, {translateY: pan.y}],
          }}
          {...panResponder.panHandlers}
        >
          <TouchableHighlight
            style={styles.tileImageAndTitle}
            onPress={props.onPress}
            underlayColor={ 'transparent' }
          >
            <View style={styles.tileImageAndTitle}>
              <Image
                style={styles.tileImage}
                source={{uri:props.image}}
                defaultSource={require("./assets/cocktail-shaker.png")}
              />
              <Text
                style={styles.tileTitle}
              >
                {props.drink["strDrink"]}
              </Text>
            </View>
          </TouchableHighlight>
        </Animated.View>
      </View>
    )
  } else {
    return(
      <View style={styles.cocktailTile}>
        <TouchableHighlight
          onPress={props.onPress}
          underlayColor={ 'transparent' }
        >
          <View style={styles.tileImageAndTitle}>
            <Image
              style={styles.tileImage}
              source={{uri:props.image}}
              defaultSource={require("./assets/cocktail-shaker.png")}
            />
            <Text style={styles.tileTitle}>
            {props.drink["strDrink"]}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cocktailTile: {
    flex: 1,
    margin: 10,
    borderRadius: 5,
  },
  tileImageAndTitle: {
    aspectRatio: 1,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: 'midnightblue',
  },
  tileImage: {
    flex: 1,
    height: "100%",
    width: "100%",
    borderRadius: 5
  },
  tileTitle: {
    color: 'white'
  }
})
