// HeaderBar.tsx
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../theme/theme';
import Svg, {Rect, Image as SvgImage} from 'react-native-svg';

interface HeaderBarProps {
  title?: string;
  onLeftIconPress: () => void;
  onRightIconPress: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  onLeftIconPress,
  onRightIconPress,
}) => {
  return (
    <View style={styles.HeaderContainer}>
      <TouchableOpacity onPress={onLeftIconPress}>
        <Svg width="55" height="40" style={styles.LeftIcon}>
          <Rect
            width="55"
            height="40"
            x="0"
            y="0"
            rx="10"
            ry="10"
            fill={COLORS.darkSlateBlueHex}
          />
          <SvgImage
            x="5"
            y="5"
            width="45"
            height="35"
            href={require('../assets/icon/left.png')}
          />
        </Svg>
      </TouchableOpacity>
      <Text style={styles.HeaderText}>{title}</Text>
      <TouchableOpacity onPress={onRightIconPress}>
        <Svg width="55" height="40" style={styles.PlusIcon}>
          <Rect
            width="50"
            height="40"
            x="0"
            y="0"
            rx="10"
            ry="10"
            fill={COLORS.darkSlateBlueHex}
          />
          <SvgImage
            x="4"
            y="1"
            width="45"
            height="40"
            href={require('../assets/icon/plus.png')}
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: COLORS.headerBlack,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  HeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryYellowHex,
    flex: 1,
    textAlign: 'center',
  },
  LeftIcon: {
    width: 40,
    height: 40,
    marginRight: 20,
  },
  PlusIcon: {
    width: 40,
    height: 40,
    marginLeft: 20,
  },
});

export default HeaderBar;
