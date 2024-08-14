import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import TabNavigator from './src/navigators/TabNavigator';
import HomeScreen from './src/screens/HomeScreen';
import CreateIngredients from './src/screens/DetailScreen/Create/CreateIngredients';
import CreateBrand from './src/screens/DetailScreen/Create/CreateBrand';
import CreateRecipe from './src/screens/DetailScreen/Create/CreateRecipe';
import CreateIngredientsList from './src/screens/DetailScreen/Create/CreateIngredientsList';
import SearchBrand from './src/screens/DetailScreen/Search/SearchBrand';
import SearchRecipe from './src/screens/DetailScreen/Search/SearchRecipe';
import Recipe from './src/screens/Recipe';
import SearchPurchasing from './src/screens/DetailScreen/Search/SearchPurchasing';
import CreatePurchasing from './src/screens/DetailScreen/Create/CreatePurchasing';
import SearchIngredientPur from './src/screens/DetailScreen/Search/SearchIngredientPur';
import SearchIngredientBr from './src/screens/DetailScreen/Search/SearchIngredientBr';

import SelectedIngredients from './src/screens/DetailScreen/Selected/SelectedIngredients';
import SearchPlacesOfPurchase from './src/screens/DetailScreen/Search/SearchPlacesOfPurchase';
import CreatePlacesOfPurchase from './src/screens/DetailScreen/Create/CreatePlacesOfPurchases';
import StockInventory from './src/screens/StockInventory';
import SelectedStocks from './src/screens/DetailScreen/Selected/SelectedStocks';
import Ingredients from './src/screens/Ingredients';
import PurchaseOrder from './src/screens/PurchaseOrder';
import SelectedBrands from './src/screens/DetailScreen/Selected/SelectedBrands';
import SearchProduct from './src/screens/DetailScreen/Search/SearchProduct';
import SearchPlace from './src/screens/DetailScreen/Search/SearchPlace';
import SelectedRecipes from './src/screens/DetailScreen/Selected/SelectedRecipes';
import ActivityReportPlan from './src/screens/DetailScreen/ActivityReportPlan';
import CreatePlan from './src/screens/DetailScreen/Create/CreatePlan';
import Plan from './src/screens/Plan';
import SearchPlan from './src/screens/DetailScreen/Search/SearchPlan';
import StockIn from './src/screens/StockIn';
import SearchIngredientList from './src/screens/DetailScreen/Search/SearchIngredientList';
import SettingStock from './src/screens/DetailScreen/SettingStock';
type RootStackParamList = {
  Tab: undefined;
  Home: undefined;
  CreateIngredients: undefined;
  CreateBrand: undefined;
  SearchBrand: undefined;
  CreateRecipe: undefined;
  CreateIngredientsList: undefined;
  SearchRecipe: undefined;
  Recipe: {selectedRecipe: any};
  SearchPurchasing: undefined;
  CreatePurchasing: undefined;
  SearchIngredientBr: undefined;
  SearchIngredientPur: undefined;
  SelectedIngredients: undefined;
  SearchPlacesOfPurchase: undefined;
  CreatePlacesOfPurchase: undefined;
  StockInventory: undefined;
  SelectedStocks: undefined;
  Ingredients: undefined;
  PurchaseOrder: undefined;
  SelectedBrands: undefined;
  SearchProduct: undefined;
  SearchPlace: undefined;
  SelectedRecipes: undefined;
  ActivityReportPlan: undefined;
  CreatePlan: undefined;
  Plan: undefined;
  SearchPlan: undefined;
  StockIn: undefined;
  SearchIngredientList: undefined;
  SettingStock: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="Tab"
          component={TabNavigator}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="CreateIngredients"
          component={CreateIngredients}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="CreateBrand"
          component={CreateBrand}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SearchBrand"
          component={SearchBrand}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="CreateRecipe"
          component={CreateRecipe}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="CreateIngredientsList"
          component={CreateIngredientsList}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SearchRecipe"
          component={SearchRecipe}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="Recipe"
          component={Recipe}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SearchPurchasing"
          component={SearchPurchasing}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="CreatePurchasing"
          component={CreatePurchasing}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SearchIngredientBr"
          component={SearchIngredientBr}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SearchIngredientPur"
          component={SearchIngredientPur}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SelectedIngredients"
          component={SelectedIngredients}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SearchPlacesOfPurchase"
          component={SearchPlacesOfPurchase}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="CreatePlacesOfPurchase"
          component={CreatePlacesOfPurchase}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="StockInventory"
          component={StockInventory}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SelectedStocks"
          component={SelectedStocks}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="Ingredients"
          component={Ingredients}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="PurchaseOrder"
          component={PurchaseOrder}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SelectedBrands"
          component={SelectedBrands}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SearchProduct"
          component={SearchProduct}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SearchPlace"
          component={SearchPlace}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SelectedRecipes"
          component={SelectedRecipes}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="ActivityReportPlan"
          component={ActivityReportPlan}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="CreatePlan"
          component={CreatePlan}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="Plan"
          component={Plan}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SearchPlan"
          component={SearchPlan}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="StockIn"
          component={StockIn}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SearchIngredientList"
          component={SearchIngredientList}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="SettingStock"
          component={SettingStock}
          options={{animation: 'slide_from_bottom'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
