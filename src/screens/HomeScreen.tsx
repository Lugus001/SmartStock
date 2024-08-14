import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE} from '../theme/theme';
import Svg, {Rect, Image as SvgImage, Text as SvgText} from 'react-native-svg';

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.HeadText}>STOCK SMART</Text>
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Plan')}>
          <Svg width="200" height="150">
            <Rect
              width="150"
              height="140"
              x="20.5"
              y="10"
              rx="20"
              ry="20"
              fill={COLORS.darkSlateBlueHex}
            />
            <SvgImage
              x="28"
              y="1"
              width="145"
              height="145"
              href={require('../assets/icon/plan.png')}
            />
            <SvgText
              x="95"
              y="135"
              fill={COLORS.primaryWhiteHex}
              fontSize="13"
              textAnchor="middle">
              Plan
            </SvgText>
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Recipe')}>
          <Svg width="200" height="150">
            <Rect
              width="150"
              height="140"
              x="20.5"
              y="10"
              rx="20"
              ry="20"
              fill={COLORS.darkSlateBlueHex}
            />
            <SvgImage
              x="34"
              y="25"
              width="120"
              height="90"
              href={require('../assets/icon/recipe.png')}
            />
            <SvgText
              x="95"
              y="135"
              fill={COLORS.primaryWhiteHex}
              fontSize="13"
              textAnchor="middle">
              Recipe
            </SvgText>
          </Svg>
        </TouchableOpacity>
      </View>
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('StockIn')}>
          <Svg width="200" height="150">
            <Rect
              width="150"
              height="140"
              x="30"
              y="10"
              rx="20"
              ry="20"
              fill={COLORS.darkSlateBlueHex}
            />
            <SvgImage
              x="45"
              y="15"
              width="120"
              height="110"
              href={require('../assets/icon/plus.png')}
            />
            <SvgText
              x="105"
              y="135"
              fill={COLORS.primaryWhiteHex}
              fontSize="13"
              textAnchor="middle">
              Stock In
            </SvgText>
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('StockInventory')}>
          <Svg width="200" height="150">
            <Rect
              width="150"
              height="140"
              x="20.5"
              y="10"
              rx="20"
              ry="20"
              fill={COLORS.darkSlateBlueHex}
            />
            <SvgImage
              x="34"
              y="20"
              width="120"
              height="110"
              href={require('../assets/icon/box.png')}
            />
            <SvgText
              x="95"
              y="135"
              fill={COLORS.primaryWhiteHex}
              fontSize="13"
              textAnchor="middle">
              Stock Inventory
            </SvgText>
          </Svg>
        </TouchableOpacity>
      </View>
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('PurchaseOrder')}>
          <Svg width="200" height="150">
            <Rect
              width="150"
              height="140"
              x="20.5"
              y="10"
              rx="20"
              ry="20"
              fill={COLORS.darkSlateBlueHex}
            />
            <SvgImage
              x="40"
              y="15"
              width="120"
              height="100"
              href={require('../assets/icon/purchase.png')}
            />
            <SvgText
              x="95"
              y="135"
              fill={COLORS.primaryWhiteHex}
              fontSize="13"
              textAnchor="middle">
              Purchase Order
            </SvgText>
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Ingredients')}>
          <Svg width="200" height="150">
            <Rect
              width="150"
              height="140"
              x="30"
              y="10"
              rx="20"
              ry="20"
              fill={COLORS.darkSlateBlueHex}
            />
            <SvgImage
              x="45"
              y="15"
              width="120"
              height="100"
              href={require('../assets/icon/cart.png')}
            />
            <SvgText
              x="105"
              y="135"
              fill={COLORS.primaryWhiteHex}
              fontSize="13"
              textAnchor="middle">
              Ingredients
            </SvgText>
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backGround,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 15,
  },
  HeadText: {
    fontFamily: FONTFAMILY.Poly,
    color: COLORS.primaryYellowHex,
    fontSize: FONTSIZE.size_40,
    marginBottom: 20,
  },
});

export default HomeScreen;
