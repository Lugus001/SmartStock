import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import NameIconBar from '../../components/NameIconBar';
import {COLORS} from '../../theme/theme';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const ActivityReportPlan = () => {
  const [allRecipeData, setAllRecipeData] = useState([]);
  const [allPlanData, setAllPlanData] = useState([]);

  const navigation = useNavigation();

  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  async function getAllData() {
    try {
      const [recipeRes, planRes] = await Promise.all([
        axios.get('http://192.168.186.217:8083/get-all-recipe'),
        axios.get('http://192.168.186.217:8083/get-all-plan'),
      ]);

      if (Array.isArray(recipeRes.data.data)) {
        console.log(
          'Fetched Recipe Data:',
          JSON.stringify(recipeRes.data.data, null, 2),
        );
        setAllRecipeData(recipeRes.data.data);
      } else {
        console.error(
          'Fetched recipe data is not an array:',
          recipeRes.data.data,
        );
      }

      if (Array.isArray(planRes.data.data)) {
        console.log(
          'Fetched Plan Data:',
          JSON.stringify(planRes.data.data, null, 2),
        );
        setAllPlanData(planRes.data.data);
      } else {
        console.error('Fetched plan data is not an array:', planRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    getAllData();
  }, []);

  const Card = ({data}) => {
    const plan = allPlanData.find(plan => plan.name === data.name);
    const qd = plan ? parseFloat(plan.qd) : NaN;
    console.log('planQDemand:', qd);

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.label}>{data.name}</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>No.</Text>
          <Text style={styles.tableHeaderCell}>Ingredient</Text>
          <Text style={styles.tableHeaderCell}>Brand</Text>
          <Text style={styles.tableHeaderCell}>Gram</Text>
        </View>
        {data.ingredients.map((ingredient, index) => {
          const lg = parseFloat(ingredient.lg);
          const calculatedQuantity =
            isNaN(lg) || isNaN(qd) ? 'N/A' : Math.round(lg * qd);

          return (
            <View style={styles.tableCell} key={`${data._id}-${index}`}>
              <Text style={styles.cellContainer}>{index + 1}</Text>
              <Text style={styles.cellContainer}>{ingredient.ingredient}</Text>
              <Text style={styles.cellContainer}>{ingredient.brand}</Text>
              <Text style={styles.cellContainer}>{calculatedQuantity}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <NameIconBar
        title="Activity Report"
        onLeftIconPress={handleLeftIconPress}
      />
      <ScrollView>
        {allRecipeData.map(item => (
          <Card key={item._id} data={item} />
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ActivityReportPlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  contentContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 20,
  },
  label: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    marginBottom: 5,
    alignSelf: 'flex-start',
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
    marginRight: 15,
  },
  tableCell: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 10,
    paddingTop: 10,
    borderColor: COLORS.primaryWhiteHex,
  },
  cellContainer: {
    flex: 1,
    fontWeight: 'bold',
    color: COLORS.primaryWhiteHex,
    textAlign: 'center',
    marginRight: 10,
  },
});
