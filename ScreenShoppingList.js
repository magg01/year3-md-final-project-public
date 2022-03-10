import { ScrollView } from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';

export function ScreenShoppingList({navigation, route}){
  return(
    //change to flat list
    <ScrollView>
      <TableView>
        <Section>
          <Cell title="Ingredient 1" />
        </Section>
      </TableView>
    </ScrollView>
  )
}
