import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MainScreen } from './MainScreen';
import { CocktailDetailApi } from './CocktailDetailApi';
import { CocktailDetailRecipeBook } from './CocktailDetailRecipeBook';
import { SearchScreen } from './SearchScreen';
import { RecipeBookScreen } from './RecipeBookScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {

  return (
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
          options= {
            ({route}) => ({
              title: route.params.drink["strDrink"]
            })
          }
        />
        <Stack.Screen
          name="CocktailDetailRecipeBook"
          component={CocktailDetailRecipeBook}
          options= {
            ({route}) => ({
              title: route.params.drink["strDrink"]
            })
          }
        />
        <Stack.Screen
          name="RecipeBookScreen"
          component={RecipeBookScreen}
          options={{title: "Recipe book"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
