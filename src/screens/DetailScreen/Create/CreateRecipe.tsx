import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import NameIconBar from '../../../components/NameIconBar';
import SaveButton from '../../../components/SaveButton';
import {COLORS} from '../../../theme/theme';
import axios from 'axios';
import Svg, {Rect, Image as SvgImage} from 'react-native-svg';
import {useNavigation, useRoute} from '@react-navigation/native';

const CreateRecipe = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [recipeName, setRecipeName] = useState('');
  const [quantityPro, setQuantityPro] = useState(0);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    if (route.params?.selectedIngredient) {
      const {ingredient, brand} = route.params.selectedIngredient;
      addIngredient(ingredient, brand);
    }
  }, [route.params?.selectedIngredient]);

  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  const addIngredient = (ingredient, brand) => {
    if (ingredient && brand) {
      setIngredients([
        ...ingredients,
        {
          ingredient,
          brand,
          lg: '', // Initialize lg as an empty string
        },
      ]);
    } else {
      Alert.alert('Please select an ingredient and brand');
    }
  };

  const deleteIngredient = index => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const clearIngredients = () => {
    setIngredients([]);
  };

  const handleSaveRecipe = async () => {
    try {
      const response = await axios.post('http://192.168.186.217:8083/recipe', {
        name: recipeName,
        qpro: quantityPro,
        ingredients: ingredients.map(ingredient => ({
          ingredient: ingredient.ingredient,
          brand: ingredient.brand,
          lg: ingredient.lg,
        })),
      });
      if (response.status === 201) {
        Alert.alert('Success', 'Recipe saved successfully');
        setRecipeName('');
        clearIngredients();
        setQuantityPro(0);
      } else {
        Alert.alert('Error', 'Failed to save recipe');
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', `Server error: ${error.response.data.error}`);
      } else {
        Alert.alert('Error', 'Network Error: Unable to connect to the server.');
      }
    }
  };

  const handleLgChange = (index, text) => {
    const newIngredients = [...ingredients];
    newIngredients[index].lg = text;
    setIngredients(newIngredients);
  };

  const navigateToSearchIngredientList = () => {
    navigation.navigate('SearchIngredientList');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <NameIconBar
          title="Create Recipe"
          onLeftIconPress={handleLeftIconPress}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.label}>Name :</Text>
          <TextInput
            style={styles.nameInput}
            value={recipeName}
            onChangeText={setRecipeName}
            placeholder="Enter Recipe Name"
            placeholderTextColor={COLORS.primaryDarkGreyHex}
          />
          <Text style={styles.label}> Quantity of Product (piece) :</Text>
          <TextInput
            style={[
              styles.orderNumInput,
              {color: COLORS.primaryWhiteHex, textAlign: 'center'},
            ]}
            value={quantityPro.toString()}
            keyboardType="numeric"
            onChangeText={text => setQuantityPro(Number(text))}
            placeholder="Enter Quantity"
            placeholderTextColor={COLORS.primaryDarkGreyHex}
          />
        </View>
        <View style={{marginTop: 20, flexDirection: 'row'}}>
          <Text style={styles.sectionTitle}>Create Ingredients List</Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearIngredients}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, {paddingLeft: 15}]}>No.</Text>
          <Text style={styles.tableHeaderCell}>Ingredient</Text>
          <Text style={styles.tableHeaderCell}>Brand</Text>
          <Text style={styles.tableHeaderCell}>Gram</Text>
        </View>
        {ingredients.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, {paddingRight: 20}]}>
              {index + 1}
            </Text>
            <Text style={[styles.tableCell]}>{item.ingredient}</Text>
            <Text style={[styles.tableCell]}>{item.brand}</Text>
            <TextInput
              keyboardType="numeric"
              style={[styles.tableCell, styles.lgInput]}
              value={item.lg}
              onChangeText={text => handleLgChange(index, text)}
            />

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

        <View style={styles.inputRow}>
          <Button
            title="Search Ingredient"
            onPress={navigateToSearchIngredientList}
          />
        </View>
        <View style={styles.saveButton}>
          <SaveButton onPress={handleSaveRecipe} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateRecipe;

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
    marginTop: 20,
  },
  textContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  label: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  nameInput: {
    width: 350,
    height: 40,
    backgroundColor: COLORS.darkSlateBlueHex,
    borderRadius: 5,
    paddingHorizontal: 24,
    color: COLORS.primaryWhiteHex,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: COLORS.darkSlateBlueHex,
    padding: 10,
    marginVertical: 10,
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
    marginRight: 40,
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
  lgInput: {
    backgroundColor: COLORS.darkSlateBlueHex,
    borderRadius: 5,
    padding: 5,
    color: COLORS.primaryWhiteHex,
    textAlign: 'center',
  },
  deleteButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  saveButton: {
    paddingHorizontal: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  clearButton: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: COLORS.red,
    marginLeft: 'auto',
    marginRight: 10,
  },
  clearButtonText: {
    color: COLORS.primaryWhiteHex,
    fontWeight: 'bold',
  },
});
