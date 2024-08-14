import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Svg, {Rect, Image as SvgImag, Text as SvgText} from 'react-native-svg';
import {COLORS} from '../theme/theme';

interface LeftIconProps {
  title?: string;
  onLeftIconPress: () => void;
}

const LeftIcon: React.FC<LeftIconProps> = ({title, onLeftIconPress}) => {
  return (
    <View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  LeftIcon: {
    width: 40,
    height: 40,
    marginRight: 25,
    backgroundColor: COLORS.headerBlack,
  },
});

export default LeftIcon;
