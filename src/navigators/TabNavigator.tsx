import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet} from 'react-native';
import {COLORS} from '../theme/theme';
import {BlurView} from '@react-native-community/blur';
//import HomeScreen from '../screens/HomeScreen';
import Ingredients from '../screens/Ingredients';
import StockInventory from '../screens/StockInventory';
import StockIn from '../screens/StockIn';
import PurchaseOrder from '../screens/PurchaseOrder';
import Recipe from '../screens/Recipe';
import Plan from '../screens/Plan';

// Import image for Icons
import box from '../assets/icon/box.png';
import cart from '../assets/icon/cart.png';
//import home from '../assets/icon/home.png';
import plus from '../assets/icon/plus.png';
import purchase from '../assets/icon/purchase.png';
import recipe from '../assets/icon/recipe.png';
import plan from '../assets/icon/plan.png';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarBackground: () => (
          <BlurView
            overlayColor=""
            blurAmount={15}
            style={styles.BlurViewStyles}
          />
        ),
      }}>
      {/*<Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={home}
              style={{
                width: 52,
                height: 50,
                tintColor: focused
                  ? COLORS.primaryYellowHex
                  : COLORS.secondaryLightGreyHex,
              }}
            />
          ),
        }}
      />*/}
      <Tab.Screen
        name="Ingredient"
        component={Ingredients}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={cart}
              style={{
                width: 46,
                height: 44,
                tintColor: focused
                  ? COLORS.primaryYellowHex
                  : COLORS.secondaryLightGreyHex,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="StockInventory"
        component={StockInventory}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={box}
              style={{
                width: 47,
                height: 45,
                tintColor: focused
                  ? COLORS.primaryYellowHex
                  : COLORS.secondaryLightGreyHex,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="StockIn"
        component={StockIn}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={plus}
              style={{
                width: 52,
                height: 50,
                tintColor: focused
                  ? COLORS.primaryYellowHex
                  : COLORS.secondaryLightGreyHex,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PurchaseOrder"
        component={PurchaseOrder}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={purchase}
              style={{
                width: 57.6,
                height: 55.23,
                tintColor: focused
                  ? COLORS.primaryYellowHex
                  : COLORS.secondaryLightGreyHex,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Recipe"
        component={Recipe}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={recipe}
              style={{
                width: 50.6,
                height: 48.23,
                tintColor: focused
                  ? COLORS.primaryYellowHex
                  : COLORS.secondaryLightGreyHex,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Plan"
        component={Plan}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={plan}
              style={{
                width: 75,
                height: 55.23,
                tintColor: focused
                  ? COLORS.primaryYellowHex
                  : COLORS.secondaryLightGreyHex,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    position: 'absolute',
    backgroundColor: COLORS.primaryBlackRGBA,
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: 'transparent',
  },
  BlurViewStyles: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default TabNavigator;
