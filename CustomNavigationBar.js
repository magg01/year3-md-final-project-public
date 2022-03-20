import { Appbar } from 'react-native-paper';
import { addToShoppingList } from './ShoppingList';
import { saveToRecipeBook, removeDrink, addToFavourites, removeFromFavourites, confirmRecipeRemoval } from './RecipeBook';

export function CustomNavigationBar({navigation, back, options, ...props}) {

  async function recipeRemovalConfirmed(){
    await removeDrink(props.drink.idDrink)
    navigation.goBack()
  }

  if (props.screenName === "ShoppingListScreen"){
    return (
      <Appbar.Header>
        { back ?  <Appbar.BackAction onPress={navigation.goBack} /> : null}
        <Appbar.Content title={options.headerTitle} />
        { props.updateShoppingListIconButtonVisible ? <Appbar.Action icon="trash-can" onPress={props.shoppingListIconButtonOnPress} /> : null }
        </Appbar.Header>
    )
  }

  return (
    <Appbar.Header>
      { back ?  <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={options.headerTitle} />
      { props.removeFromRecipeBookAction ?
          <Appbar.Action
            icon="book-remove"
            onPress={async () => {
              await confirmRecipeRemoval() ?
                recipeRemovalConfirmed()
              :
                null
            }}
          />
        : null}
      { props.replaceImageAction ? <Appbar.Action icon="camera" onPress={() => navigation.navigate("RecipeBookScreenStack", {screen: "ScreenCameraAddImage", params: {drinkId: props.drink.idDrink}})} /> : null }
      { props.addToRecipeBookAction ? <Appbar.Action icon="book-plus" onPress={() => saveToRecipeBook(props.drink)} /> : null}
      { props.addToShoppingListAction ? <Appbar.Action icon="cart-arrow-down" onPress={() => addToShoppingList(props.drink)} /> : null}
      { props.showFavouriteAction ?
          props.addRemoveToFromFavouritesAction ?
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
        :
          null
      }
    </Appbar.Header>
  );
}
