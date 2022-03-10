import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MainScreen } from './MainScreen';
import { CocktailDetailApi } from './CocktailDetailApi';
import { CocktailDetailRecipeBook } from './CocktailDetailRecipeBook';
import { SearchScreen } from './SearchScreen';
import { RecipeBookScreen } from './RecipeBookScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootSiblingParent } from 'react-native-root-siblings';

const Stack = createStackNavigator();

export default function App() {

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
