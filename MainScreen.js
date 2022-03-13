import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, TextInput, View, Button } from 'react-native';

export function MainScreen({navigation}) {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          onChangeText={text => setSearchText(text)}
          defaultValue={searchText}
        />
        <Button
          title="Search"
          accessibilityLabel="Search for cocktails"
          onPress={() => navigation.navigate("SearchScreen", {searchText})}
        />
        <Button
          title="Recipe book"
          accessibilityLabel="Open the recipe book"
          onPress={() => navigation.navigate("RecipeBookScreen")}
        />
        <Button
          title="Shopping list"
          accessibilityLabel="Go to the shopping list"
          onPress={() => navigation.navigate("ScreenShoppingList")}
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar:{
    height: 50,
    width: 200,
    borderWidth: 2,
    borderColor: 'black',
  }

});
