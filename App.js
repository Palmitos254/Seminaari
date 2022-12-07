import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Etusivu from "./Etusivu";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Ostoslista" component={Etusivu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}