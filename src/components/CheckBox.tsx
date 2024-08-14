import React from 'react';
import {TouchableOpacity} from 'react-native';
import Svg, {Rect, Image as SvgImage} from 'react-native-svg';

const CheckBox = ({isChecked, onPress, style}) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Svg width="90" height="80">
        <SvgImage
          x="3"
          y="4"
          width="90"
          height="80"
          href={require('../assets/icon/circle.png')} // Constant circle image
        />
        {isChecked && (
          <SvgImage
            x="3"
            y="4"
            width="90"
            height="80"
            href={require('../assets/icon/check.png')} // Check image when checked
          />
        )}
      </Svg>
    </TouchableOpacity>
  );
};

export default CheckBox;
