import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS} from '../theme/theme';

const SaveButton = ({onPress}) => {
  // ** only UI//
  return (
    <View style={styles.contentContainer}>
      <Text>
        <TouchableOpacity style={styles.saveButton} onPress={onPress}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

export default SaveButton;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: COLORS.primaryYellowHex,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: COLORS.primaryBlackHex,
    fontWeight: 'bold',
  },
});
