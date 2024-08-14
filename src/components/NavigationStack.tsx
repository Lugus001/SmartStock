import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import Ingredients from '../screens/Ingredients';
import PurchaseOrder from '../screens/PurchaseOrder';
import Recipe from '../screens/Recipe';
import StockIn from '../screens/StockIn';
import StockInventory from '../screens/StockInventory';
import Plan from '../screens/Plan';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Ingredients" component={Ingredients} />
      <Stack.Screen name="StockInventory" component={StockInventory} />
      <Stack.Screen name="StockIn" component={StockIn} />
      <Stack.Screen name="PurchaseOrder" component={PurchaseOrder} />
      <Stack.Screen name="Recipe" component={Recipe} />
      <Stack.Screen name="Plan" component={Plan} />
    </Stack.Navigator>
  );
};
export default AppStack;
