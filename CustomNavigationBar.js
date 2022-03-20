import { useState, useRef } from 'react';
import { Platform, View } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import { addToShoppingList } from './ShoppingList';
import { saveToRecipeBook, removeDrink, addToFavourites, removeFromFavourites, confirmRecipeRemoval } from './RecipeBook';

export function CustomNavigationBar({navigation, back, options, ...props}) {
  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  const [menuVisible, setMenuVisible] = useState(false);

  async function recipeRemovalConfirmed(){
    await removeDrink(props.drink.idDrink)
    navigation.goBack()
  }

  function openMenu(){
    setMenuVisible(true)
  }

  function closeMenu(){
    setMenuVisible(false)
  }

  if (props.screenName === "ShoppingListScreen"){
    return (
      <Appbar.Header>
        { back ?  <Appbar.BackAction onPress={navigation.goBack} /> : null}
        <Appbar.Content title={options.headerTitle} />
        { props.updateShoppingListIconButtonVisible ? <Appbar.Action icon="trash-can" onPress={props.shoppingListIconButtonOnPress} /> : null }
      </Appbar.Header>
    )
  } else if (props.screenName === "CocktailDetailRecipeBookScreen"){
    return (
      <Appbar.Header>
        { back ?  <Appbar.BackAction onPress={navigation.goBack} /> : null}
        <Appbar.Content title={options.headerTitle} />
        {props.addRemoveToFromFavouritesAction ?
          <Appbar.Action
            icon="star"
            onPress={() => {
              removeFromFavourites(props.drink.idDrink)
              props.changeFavouriteState(false)
            }}
          />
        :
          <Appbar.Action
            icon="star-outline"
            onPress={() => {
              addToFavourites(props.drink.idDrink)
              props.changeFavouriteState(true)
            }}
          />
        }
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<Appbar.Action icon={MORE_ICON} onPress={() => setMenuVisible(!menuVisible)} />}
        >
          <Menu.Item
            icon="camera"
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate(
                "RecipeBookScreenStack",
                {screen: "ScreenCameraAddImage", params: {drinkId: props.drink.idDrink}}
              )
            }}
            title="Replace picture"
          />
          <Menu.Item
            icon="cart-arrow-down"
            onPress={() => {
              setMenuVisible(false);
              addToShoppingList(props.drink);
            }}
            title="Add to shopping list" />
          <Menu.Item
            icon="book-remove"
            onPress={async () => {
              setMenuVisible(false)
              await confirmRecipeRemoval() ?
                recipeRemovalConfirmed()
              :
                null
            }}
            title="Remove from book" />
        </Menu>
      </Appbar.Header>
    )
  } else if (props.screenName === "CocktailDetailApiScreen"){
    return (
      <Appbar.Header>
        { back ?  <Appbar.BackAction onPress={navigation.goBack} /> : null}
        <Appbar.Content title={options.headerTitle} />
        <Appbar.Action icon="book-plus" onPress={() => saveToRecipeBook(props.drink)} />
        <Appbar.Action icon="cart-arrow-down" onPress={() => {addToShoppingList(props.drink)}}
        />
      </Appbar.Header>
    )
  }
}
