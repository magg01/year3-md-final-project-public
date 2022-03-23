import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, KeyboardAvoidingView, StyleSheet, View, Image, TextInput, Dimensions} from 'react-native';
import { Appbar, Modal, Portal, Text, Title, Provider } from 'react-native-paper';
import { TableView, Section, Cell } from 'react-native-tableview-simple';
import { useFocusEffect } from '@react-navigation/native'
import {
  getFromRecipeBook,
  updateRecipe,
  removeDrink,
  confirmRecipeRemoval,
  addToFavourties,
  removeFromFavourties} from './RecipeBook';
import { addToShoppingList } from './ShoppingList';
import { LoadingAnimation } from './LoadingAnimation';
import { CustomNavigationBar } from './CustomNavigationBar';
import { ingredientListKeysFromApi, measureListKeysFromApi } from './Constants';

export function CocktailDetailRecipeBook({navigation, route}){
  const [notesText, setNotesText] = useState(undefined);
  const [currentDrink, setCurrentDrink] = useState(undefined);
  const [currentImageUri, setCurrentImageUri] = useState(undefined);
  const [isDrinkFavourite, setIsDrinkFavourite] = useState(undefined);
  const [currentDrinkIngredients, setCurrentDrinkIngredients] = useState(undefined);
  const [directionsModalVisible, setDirectionsModalVisible] = useState(false);
  const { width, height } = Dimensions.get('window');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await setCurrentDrink(await getFromRecipeBook(route.params.drinkId));
      })()
    },[route.params.drinkId])
  );

  useEffect(() => {
    if(currentDrink != undefined){
      setCurrentImageUri(currentDrink["strDrinkThumb"]);
      setIsDrinkFavourite(currentDrink["favourite"]);
    }
  }, [currentDrink])

  async function recipeRemovalConfirmed(){
    await removeDrink(currentDrink["idDrink"])
    navigation.goBack()
  }

  useEffect(() => {
    if(currentDrink != undefined){
      let ingredients = {}
      for(let key in ingredientListKeysFromApi){
        if(currentDrink[ingredientListKeysFromApi[key]] && currentDrink[ingredientListKeysFromApi[key]].trim() != ""){
          ingredients[key] = {ingredient: currentDrink[ingredientListKeysFromApi[key]], measure: currentDrink[measureListKeysFromApi[key]]}
        } else {
          break
        }
      }
      setCurrentDrinkIngredients(ingredients);
    }
  }, [currentDrink])

  useEffect(() => {
    if(currentDrink != undefined){
      navigation.setOptions({
        headerTitle: currentDrink["strDrink"],
        header: (props) => {
          return (
            <CustomNavigationBar
              drink={currentDrink}
              screenName={"CocktailDetailRecipeBookScreen"}
              addRemoveToFromFavouritesAction={isDrinkFavourite}
              changeFavouriteState={(isFavourite) => setIsDrinkFavourite(isFavourite)}
              {...props}
            />
          )
        }
      })
    }
  }, [currentDrink, isDrinkFavourite])

  async function saveNotes(){
    let drink = currentDrink;
    drink["strNotes"] = notesText;
    updateRecipe(drink);
    setCurrentDrink(drink);
  }

  const showDirectionsModal = () => {
    setDirectionsModalVisible(true);
  }

  const hideDirectionsModal = () => {
    setDirectionsModalVisible(false);
  }

  if(currentDrink === undefined || currentDrinkIngredients === undefined){
    return (
      <LoadingAnimation
        loadingMessage="fetching drink"
        style={{width: 200, height: 200}}
      />
    )
  } else {
    return(
      <SafeAreaView>
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <View style={styles.container}>
            <Image
              style={styles.cocktailImage}
              source={{uri: currentDrink["strDrinkThumb"]}}
              loadingIndicatorSource={require("./assets/cocktail-shaker.png")}
            />
            {currentDrink.strImageAttribution ?
              <Text style={[styles.imageAttributionText, {top: width - 20}]}>Image: {currentDrink.strImageAttribution}</Text>
              :
              null
            }
            <View style={styles.cocktailDetails}>
                <TableView>
                  <Section header={"Overview"}>
                    { currentDrink.strGlass ?
                        <Cell cellStyle={"RightDetail"} title={currentDrink.strGlass} detail={"glass"} />
                      :
                        null
                    }
                    { currentDrink.strIBA ?
                        <Cell cellStyle={"RightDetail"} title={currentDrink.strIBA} detail={"IBA category"} />
                      :
                        null
                    }
                    { currentDrink.strCategory ?
                        <Cell cellStyle={"RightDetail"} title={currentDrink.strCategory} detail={"category"} />
                      :
                        null
                    }
                  </Section>
                  <Section header={"Ingredients"}>
                    {Object.keys(currentDrinkIngredients).map((ingredientKey) => (
                        <Cell key={ingredientKey} cellStyle={"RightDetail"} title={currentDrinkIngredients[ingredientKey].ingredient} detail={currentDrinkIngredients[ingredientKey].measure} />
                      :
                        null
                    ))}
                  </Section>
                  <Section header={"Directions"}>
                  <Cell
                    onPress={() => showDirectionsModal()}
                    contentContainerStyle={{ alignItems: 'flex-start', height: 60 }}
                    cellContentView={
                      <Text style={{ flex: 1, fontSize: 16 }}>
                        {currentDrink["strInstructions"]}
                      </Text>
                    }
                  />
                  </Section>
                  <Section header={"Notes"}>
                    <Cell
                      contentContainerStyle={{ alignItems: 'flex-start'}}
                      cellContentView={
                        <TextInput
                          placeholder="Add your own notes here."
                          onChangeText={text => setNotesText(text)}
                          defaultValue={currentDrink["strNotes"]}
                          onBlur={() => saveNotes()}
                          multiline={true}
                        />
                      }
                    />
                  </Section>
                </TableView>
            </View>
          </View>
        </ScrollView>
        <Provider>
          <Portal>
            <Modal visible={directionsModalVisible} onDismiss={hideDirectionsModal} contentContainerStyle={styles.modalStyle}>
              <ScrollView>
                <Title>{currentDrink.strDrink}</Title>
                <TableView>
                  <Section>
                    {Object.keys(currentDrinkIngredients).map((ingredientKey) => (
                        <Cell
                          key={ingredientKey}
                          cellStyle={"RightDetail"}
                          title={currentDrinkIngredients[ingredientKey].ingredient}
                          titleTextStyle={{fontSize: 20}}
                          detail={currentDrinkIngredients[ingredientKey].measure}
                          detailTextStyle={{fontSize: 15, color: 'blue'}}
                        />
                      :
                        null
                    ))}
                  </Section>
                  <Text style={styles.modalText}>{currentDrink["strInstructions"]}</Text>
                </TableView>
              </ScrollView>
            </Modal>
          </Portal>
        </Provider>
      </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cocktailImage: {
    width: "100%",
    aspectRatio: 1,
  },
  cocktailDetails: {
    padding: "2.5%"
  },
  imageAttributionText:{
    position: 'absolute',
    color: 'white',
    right: 5,
    fontSize: 10,
  },
  directionsText: {
    fontSize: 20
  },
  modalStyle: {
    backgroundColor: 'white',
    margin: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  modalText: {
    fontSize: 20,
    lineHeight: 50,
  }
})
