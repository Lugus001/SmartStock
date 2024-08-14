import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import NameIconBar from '../../../components/NameIconBar';
import SaveButton from '../../../components/SaveButton';
import {COLORS} from '../../../theme/theme';
import axios from 'axios';
import Svg, {Image, Rect, Image as SvgImage} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';

const CreateIngredientsList = () => {
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState('');
  const [gram, setGram] = useState('');
  const navigation = useNavigation();

  // Handlers for navigation
  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  const addIngredient = () => {
    if (ingredient.trim() && gram.trim()) {
      setIngredients([
        ...ingredients,
        {ingredient: ingredient.trim(), gram: gram.trim()},
      ]);
      setIngredient('');
      setGram('');
    } else {
      Alert.alert('Please enter both ingredient and gram');
    }
  };

  // Delete Ingredient section
  const deleteIngredient = index => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSaveIngredientList = async () => {
    if (ingredients.length > 0) {
      try {
        await axios.post('http://192.168.186.217:8083/ingredientsList', {
          ingredients: ingredients,
        });
        // Clear input fields and ingredients list after saving
        setIngredients([]);
        Alert.alert('Ingredients saved successfully');
      } catch (error) {
        console.error(error);
        Alert.alert('Error saving ingredient list');
      }
    } else {
      Alert.alert('Please add at least one ingredient');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <NameIconBar
          title="    Add List"
          onLeftIconPress={handleLeftIconPress}
        />
        <View style={styles.contentContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>No.</Text>
            <Text style={styles.tableHeaderCell}>Ingredients</Text>
            <Text style={styles.tableHeaderCell}>Gram(G)</Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          {ingredients.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, {paddingLeft: 10}]}>
                {index + 1}
              </Text>
              <Text style={[styles.tableCell, {paddingLeft: 20}]}>
                {item.ingredient}
              </Text>
              <Text style={[styles.tableCell, {paddingLeft: 40}]}>
                {item.gram}
              </Text>
              <TouchableOpacity onPress={() => deleteIngredient(index)}>
                <Svg width="25" height="25" viewBox="0 0 24 24">
                  <Rect
                    width="24"
                    height="24"
                    rx="12"
                    fill={COLORS.darkSlateBlueHex}
                  />
                  <SvgImage
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    href={require('../../../assets/icon/delete.png')}
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ingredient"
            placeholderTextColor={COLORS.primaryGreyHex}
            value={ingredient}
            onChangeText={setIngredient}
          />
          <TextInput
            style={styles.input}
            placeholder="Gram"
            placeholderTextColor={COLORS.primaryGreyHex}
            value={gram}
            onChangeText={setGram}
          />
          <Button title="Add" onPress={addIngredient} />
        </View>
      </ScrollView>
      <View style={styles.saveButton}>
        <Button title="Add Ingredients" onPress={handleSaveIngredientList} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateIngredientsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 35,
  },
  textContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.primaryWhiteHex,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryWhiteHex,
    paddingBottom: 5,
    marginBottom: 10,
    paddingTop: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    color: COLORS.primaryWhiteHex,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tableCell: {
    flex: 1,
    color: COLORS.primaryWhiteHex,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    color: COLORS.primaryWhiteHex,
  },
  saveButton: {
    paddingHorizontal: 25,
    marginTop: 20,
  },
});
