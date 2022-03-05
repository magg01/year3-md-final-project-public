import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MainScreen } from './MainScreen';
import { CocktailDetail } from './CocktailDetail';
import { SearchScreen } from './SearchScreen';
import { RecipeBookScreen } from './RecipeBookScreen';
import { saveToRecipeBook } from './RecipeBook';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

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
          name="CocktailDetail"
          component={CocktailDetail}
          options= {
            ({route}) => ({
              title: route.params.drink["strDrink"],
              headerRight: () => (
                <TouchableOpacity
                  style={{paddingRight: 10}}
                  onPress={() => saveToRecipeBook(route.params.drink)}
                >
                  <Ionicons name="book-outline" size={28}/>
                  <Ionicons name="add-circle-outline" size={14} style={{position: 'absolute', paddingTop:6, paddingLeft:13}}/>
                </TouchableOpacity>
              )
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
