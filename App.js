import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MainScreen } from './MainScreen';
import { CocktailDetailApi } from './CocktailDetailApi';
import { CocktailDetailRecipeBook } from './CocktailDetailRecipeBook';
import { SearchScreen } from './SearchScreen';
import { RecipeBookScreen } from './RecipeBookScreen';
import { ScreenShoppingList } from './ScreenShoppingList';
import { ScreenCameraAddImage }  from './ScreenCameraAddImage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootSiblingParent } from 'react-native-root-siblings';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function App() {

  const resetDebug = false;
  useEffect(async () => {
    if(resetDebug){
      try{
        await AsyncStorage.clear();
      } catch (e) {
        console.log("resetDebug: encountered an error -> " + e);
      }
    }
  })

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options= {{ title: "Home"}}
          />
          <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}
            options= {{ title: "Search results"}}
          />
          <Stack.Screen
            name="CocktailDetailApi"
            component={CocktailDetailApi}
            options={{title: null}}
          />
          <Stack.Screen
            name="CocktailDetailRecipeBook"
            component={CocktailDetailRecipeBook}
            options={{title: null}}
          />
          <Stack.Screen
            name="RecipeBookScreen"
            component={RecipeBookScreen}
            options={{title: "Recipe book"}}
          />
          <Stack.Screen
            name="ScreenCameraAddImage"
            component={ScreenCameraAddImage}
            options={{title: "Add image"}}
          />
          <Stack.Screen
            name="ScreenShoppingList"
            component={ScreenShoppingList}
            options={{title: "Shopping list"}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
