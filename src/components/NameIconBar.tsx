import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Svg, {Rect, Image as SvgImag, Text as SvgText} from 'react-native-svg';
import {COLORS} from '../theme/theme';

interface NameIconBarProps {
  title?: string;
  onLeftIconPress: () => void;
}

const NameIconBar: React.FC<NameIconBarProps> = ({title, onLeftIconPress}) => {
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
          <SvgImag
            x="5"
            y="5"
            width="45"
            height="35"
            href={require('../assets/icon/left.png')}
          />
        </Svg>
      </TouchableOpacity>
      <Text style={styles.HeaderText}>{title}</Text>
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
    paddingLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryYellowHex,
  },
  LeftIcon: {
    width: 40,
    height: 40,
    marginRight: 25,
    backgroundColor: COLORS.headerBlack,
  },
});

export default NameIconBar;
