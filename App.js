import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { MainScreen } from './MainScreen';
import { CocktailDetailApi } from './CocktailDetailApi';
import { CocktailDetailRecipeBook } from './CocktailDetailRecipeBook';
import { SearchScreen } from './SearchScreen';
import { RecipeBookScreen } from './RecipeBookScreen';
import { ScreenShoppingList } from './ScreenShoppingList';
import { ScreenReviewCocktailImage } from './ScreenReviewCocktailImage';
import { ScreenCameraAddImage }  from './ScreenCameraAddImage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { RootSiblingParent } from 'react-native-root-siblings';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function App() {
  const Tab = createMaterialBottomTabNavigator();
  const MainStack = createStackNavigator()
  const RecipeBookStack = createStackNavigator();
  const ShoppingListStack = createStackNavigator();

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

  function MainScreenStack(){
    return (
      <MainStack.Navigator>
        <MainStack.Screen
          name="MainScreen"
          component={MainScreen}
          options= {{ title: "Home"}}
        />
        <MainStack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options= {{ title: "Search results"}}
        />
        <MainStack.Screen
          name="CocktailDetailApi"
          component={CocktailDetailApi}
          options={{title: null}}
        />
      </MainStack.Navigator>
    )
  }

  function RecipeBookScreenStack(){
    return(
      <RecipeBookStack.Navigator>
        <RecipeBookStack.Screen
          name="RecipeBookScreen"
          component={RecipeBookScreen}
          options={{title: "Recipe book"}}
        />
        <RecipeBookStack.Screen
          name="CocktailDetailRecipeBook"
          component={CocktailDetailRecipeBook}
          options={{title: null}}
        />
        <RecipeBookStack.Screen
          name="ScreenCameraAddImage"
          component={ScreenCameraAddImage}
          options={{title: "Add image"}}
        />
        <RecipeBookStack.Screen
          name="ScreenReviewCocktailImage"
          component={ScreenReviewCocktailImage}
          options={{title: "Review image"}}
        />
      </RecipeBookStack.Navigator>
    )
  }

  function ScreenShoppingListStack(){
    return(
      <ShoppingListStack.Navigator>
        <ShoppingListStack.Screen
          name="ScreenShoppingList"
          component={ScreenShoppingList}
          options={{title: "Shopping list"}}
        />
      </ShoppingListStack.Navigator>
    )
  }

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="MainScreenStack"
            component={MainScreenStack}
          />
          <Tab.Screen
            name="RecipeBookScreenStack"
            component={RecipeBookScreenStack}
          />
          <Tab.Screen
            name="ScreenShoppingListStack"
            component={ScreenShoppingListStack}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
}
