import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Provider as PaperProvider, DefaultTheme, Appbar, configureFonts } from 'react-native-paper';
import { Platform } from 'react-native';
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
import { MaterialIcons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const fontFamilyToUse = Platform.OS === 'ios' ? 'Chalkduster' : 'Roboto';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'lightGray',
    primary: '#1D49F2',
    accent: 'black',
    text: 'black',
    cocktailTileTitleTextColor: 'white',
    favouritesCard: '#27B2E6',
    suggestedCocktailCard: '#1DF2B7',
    appbarIconColor: 'white',
  },
  fontFamily: {...DefaultTheme.fonts.regular.fontFamily = fontFamilyToUse}
};

export default function App() {
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

  function CustomNavigationBar({navigation, back, options, ...props}) {
    return (
      <Appbar.Header>
        { back ?  <Appbar.BackAction onPress={navigation.goBack} /> : null}
        <Appbar.Content title={options.headerTitle} />
      </Appbar.Header>
    );
  }

  function MainScreenStack(){
    return (
      <MainStack.Navigator
        screenOptions={{
          header: (props) => <CustomNavigationBar {...props}  />,
        }}
      >
        <MainStack.Screen
          name="MainScreen"
          component={MainScreen}
          options= {{ headerTitle: "Home"}}
        />
        <MainStack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options= {{ headerTitle: "Search results"}}
        />
        <MainStack.Screen
          name="CocktailDetailApi"
          component={CocktailDetailApi}
          options={{headerTitle: null}}
        />
      </MainStack.Navigator>
    )
  }

  function RecipeBookScreenStack(){
    return(
      <RecipeBookStack.Navigator
        screenOptions={{
          header: (props) => <CustomNavigationBar {...props} />,
        }}
      >
        <RecipeBookStack.Screen
          name="RecipeBookScreen"
          component={RecipeBookScreen}
          options={{headerTitle: "Recipe book"}}
        />
        <RecipeBookStack.Screen
          name="CocktailDetailRecipeBook"
          component={CocktailDetailRecipeBook}
          options={{headerTitle: null, headerTitleContainerStyle: {maxWidth: "60%"}}}
        />
        <RecipeBookStack.Screen
          name="ScreenCameraAddImage"
          component={ScreenCameraAddImage}
          options={{headerTitle: "Add image"}}
        />
        <RecipeBookStack.Screen
          name="ScreenReviewCocktailImage"
          component={ScreenReviewCocktailImage}
          options={{headerTitle: "Review image"}}
        />
      </RecipeBookStack.Navigator>
    )
  }

  function ScreenShoppingListStack(){
    return(
      <ShoppingListStack.Navigator
        screenOptions={{
          header: (props) => <CustomNavigationBar {...props} />,
        }}
      >
        <ShoppingListStack.Screen
          name="ScreenShoppingList"
          component={ScreenShoppingList}
          options={{headerTitle: "Shopping list"}}
        />
      </ShoppingListStack.Navigator>
    )
  }

  return (
    <RootSiblingParent>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Tab.Navigator
            shifting={true}
            labeled={true}
            initialRouteName="MainScreenStack"
            backBehavior="initialRoute"
            barStyle={{backgroundColor: theme.colors.primary}}
          >
            <Tab.Screen
              name="RecipeBookScreenStack"
              component={RecipeBookScreenStack}
              options={{
                title: "Recipe book",
                tabBarLabel: "Recipe book",
                tabBarAccessibilityLabel: "Recipe book",
                tabBarIcon: ({color}) => (
                  <MaterialIcons name="menu-book" size={24} color={color} />
                )
              }}
            />
            <Tab.Screen
              name="MainScreenStack"
              component={MainScreenStack}
              title="Home"
              options={{
                title: "Home",
                tabBarLabel: "Home",
                tabBarAccessibilityLabel: "Home",
                tabBarIcon: ({color}) => (
                  <MaterialIcons name="home" size={24} color={color} />
                )
              }}
            />
            <Tab.Screen
              name="ScreenShoppingListStack"
              component={ScreenShoppingListStack}
              options={{
                title: "Shopping list",
                tabBarLabel: "Shopping list",
                tabBarAccessibilityLabel: "Shopping list",
                tabBarIcon: ({color}) => (
                  <MaterialIcons name="shopping-cart" size={24} color={color} />
                )
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </RootSiblingParent>
  );
}
