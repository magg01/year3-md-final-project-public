import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated, Easing} from 'react-native';
import { Text } from 'react-native-paper';

export function LoadingAnimation(props){
  const shakerAngle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          shakerAngle,
          {
            toValue:1,
            duration: 400,
            easing: Easing.bezier(0.87, 0, 0.13, 1),
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          shakerAngle,
          {
            toValue:-1,
            duration: 400,
            easing: Easing.bezier(0.87, 0, 0.13, 1),
            useNativeDriver: true,
          }
        )
      ])
    ).start()
  }, []);

  const spin = shakerAngle.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-90deg', '45deg']
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        style={[props.style, {transform: [{rotate: spin}]}]}
        source={require('./assets/cocktail-shaker.png')}
      />
      <Text>
        { "\n" }
        {props.loadingMessage}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
