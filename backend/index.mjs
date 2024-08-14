import express from 'express';
import mongoose from 'mongoose';
import {BrandInfo} from './models/BrandDetails.js'; // Note the .js extension is required for ES modules
import {IngredientsList} from './models/IngredientsListDetails.js';
import {RecipeInfo} from './models/RecipeDetails.js';
import {PurchasingInfo} from './models/PurchasingDetails.js';
import {IngredientInfo} from './models/IngredientDetails.js'; // Rename import alias
import {PlacesOfPurchaseInfo} from './models/PlaceOfPurchaseDetails.js';
import {StockInfo} from './models/StockDetails.js';
import {PlanInfo} from './models/PlanDetails.js';
import {SettingStockInfo} from './models/SettingStockDetails.js';
import {config} from 'dotenv';
config();

const mongoUrl = process.env.MONGO_URL;

console.log(process.env);
if (!mongoUrl) {
  throw new Error('MONGO_URL is not defined in the .env file');
}
const app = express();
app.use(express.json());

mongoose
  .connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Database Connected');
  })
  .catch(e => {
    console.error('Connection error', e.message); // Log connection errors
  });

// Stock Calculation Function
const calculateNewStock = (currentStock, ingredientLg, planQd, isChecked) => {
  let newStock;
  if (isChecked) {
    newStock = currentStock - ingredientLg * planQd;
  } else {
    newStock = currentStock + ingredientLg * planQd;
  }
  return Math.max(newStock, 0); // Ensure stock doesn't go below zero
};

app.post('/create-plan', async (req, res) => {
  try {
    const {planDetails} = req.body;

    // Check stock availability for each ingredient
    for (let ingredient of planDetails.recipeInfo) {
      const stockResponse = await axios.get(
        `http://localhost:8083/stocks/${ingredient.id}`,
      );
      const currentStock = stockResponse.data.g;

      const newStock = calculateNewStock(
        currentStock,
        ingredient.lg,
        planDetails.qd,
        true,
      );

      if (newStock < 0) {
        return res.status(400).json({
          error: `Not enough stock for ingredient ${
            ingredient.name
          }. Current stock: ${currentStock}, Required: ${
            ingredient.lg * planDetails.qd
          }`,
        });
      }
    }

    // If stock is adequate, save the plan and update the stock
    const newPlan = await Plan.create(planDetails);
    res.status(201).json({message: 'Plan created successfully', data: newPlan});

    // Update stock after plan creation
    for (let ingredient of planDetails.recipeInfo) {
      const stockResponse = await axios.get(
        `http://localhost:8083/stocks/${ingredient.id}`,
      );
      await axios.put(`http://localhost:8083/stocks/${ingredient.id}`, {
        g: calculateNewStock(
          stockResponse.data.g,
          ingredient.lg,
          planDetails.qd,
          true,
        ),
      });
    }
  } catch (error) {
    console.error('Plan creation error:', error.message, error);
    res.status(500).json({error: 'Failed to create plan'});
  }
});

//SettingStock section

app.get('/setting/:id', async (req, res) => {
  try {
    const setting = await SettingStockInfo.findById(req.params.id);
    if (!setting) {
      return res.status(404).json({error: 'Setting entry not found'});
    }
    res.json(setting);
  } catch (error) {
    console.error('Fetch error', error.message);
    res.status(500).json({error: 'Failed to fetch setting data'});
  }
});

// Get all setting
app.get('/get-all-setting', async (req, res) => {
  try {
    const settings = await SettingStockInfo.find({});
    console.log('Settings Data:', settings); // Log the settings data
    res.status(200).json({data: settings});
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({error: 'Failed to fetch settings'});
  }
});

// Delete a setting entry
app.delete('/setting/:id', async (req, res) => {
  try {
    const deletedSetting = await SettingStockInfo.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedSetting) {
      return res.status(404).json({error: 'setting entry not found'});
    }
    res.json({message: 'Setting entry deleted successfully'});
  } catch (error) {
    console.error('Delete error', error.message, error); // Detailed error logging
    res.status(500).json({error: 'Failed to delete setting entry'});
  }
});

//save new Places Of Purchase
app.post('/SettingStock', async (req, res) => {
  try {
    const {percentage} = req.body;
    if (!percentage) {
      return res.status(400).json({error: 'All fields are required'});
    }
    const newSettingStock = new SettingStockInfo({
      percentage,
    });
    await newSettingStock.save();
    res.status(201).json(newSettingStock);
  } catch (error) {
    console.error('Save error', error.message, error); // Detailed error logging
    res.status(500).json({error: 'Failed to save new SettingStock'});
  }
});

//Plan section
// Get all plans
app.get('/get-all-plan', async (req, res) => {
  try {
    const data = await PlanInfo.find({});
    res.send({status: 'Ok', data: data});
  } catch (error) {
    console.error('Fetch error', error.message); // Log fetch errors
    res
      .status(500)
      .send({error: 'Failed to fetch data', details: error.message});
  }
});

app.delete('/plan/:id', async (req, res) => {
  try {
    const deletePlan = await PlanInfo.findByIdAndDelete(req.params.id);
    if (!deletePlan) {
      return res.status(404).json({error: 'Plan not found'});
    }
    res.status(200).json({message: 'Plan deleted successfully'});
  } catch (error) {
    console.error('Delete plan error', error.message, error); // Detailed error logging
    res.status(500).json({error: 'Failed to delete plan '});
  }
});

// Save plan
app.post('/plan', async (req, res) => {
  try {
    const {name, qp, date, qd} = req.body;
    if (!name || !qp || !date || !qd) {
      return res.status(400).json({error: 'All fields are required'});
    }
    const recipe = await RecipeInfo.findOne({name});
    if (!recipe) {
      return res.status(404).json({error: 'Recipe not found'});
    }
    {
      {
        /* const qpro = await RecipeInfo.findOne({qp});
      if (!qpro) {
        return res.status(404).json({error: 'qp not found'});
      }*/
      }
    }

    const newPlan = new PlanInfo({
      name,
      qp,
      qd,
      date,
    });
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Save error', error.message, error); // Detailed error logging
    res.status(500).json({error: 'Failed to save plan'});
  }
});

//stock section
app.get('/get-all-stock', async (req, res) => {
  try {
    const data = await StockInfo.find({});
    res.send({status: 'Ok', data: data});
  } catch (error) {
    console.error('Fetch error', error.message); // Log fetch errors
    res
      .status(500)
      .send({error: 'Failed to fetch data', details: error.message});
  }
});

// Delete  stock

app.delete('/stock/:id', async (req, res) => {
  try {
    const deletedStock = await StockInfo.findByIdAndDelete(req.params.id);
    if (!deletedStock) {
      return res.status(404).json({error: 'stock entry not found'});
    }
    res.json({message: 'stock entry deleted successfully'});
  } catch (error) {
    console.error('stock error', error.message, error); // Detailed error logging
    res.status(500).json({error: 'Failed to delete stock entry'});
  }
});

// Get a specific stock by ID
app.get('/stocks/:id', async (req, res) => {
  try {
    const stock = await StockInfo.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({error: 'Stock entry not found'});
    }
    res.json(stock);
  } catch (error) {
    console.error('Fetch error', error.message);
    res.status(500).json({error: 'Failed to fetch stock data'});
  }
});

//save stock
app.post('/stocks', async (req, res) => {
  try {
    const {ingredient, brand, g, date} = req.body;
    if (!ingredient || !brand || !g || !date) {
      return res.status(400).json({error: 'All fields are required'});
    }
    const newStock = new StockInfo({
      ingredient,
      brand,
      g,
      date,
    });
    await newStock.save();
    res.status(201).json(newStock);
  } catch (error) {
    console.error('Save error', error.message, error); // Detailed error logging
    res.status(500).json({error: 'Failed to save Stock'});
  }
});

app.put('/stocks/:id', async (req, res) => {
  try {
    const {g} = req.body;

    // Log the entire request body for debugging
    console.log('Request body:', req.body);

    if (g === undefined || g === null) {
      return res.status(400).json({
        error: 'Stock quantity (g) is required and cannot be undefined or null',
      });
    }

    console.log('Updating stock ID:', req.params.id);
    console.log('New stock quantity (g):', g);

    const updatedStock = await StockInfo.findByIdAndUpdate(
      req.params.id,
      {g},
      {new: true},
    );

    if (!updatedStock) {
      return res.status(404).json({error: 'Stock entry not found'});
    }

    res.json({message: 'Stock updated successfully', data: updatedStock});
  } catch (error) {
    console.error('Stock update error:', error.message, error);
    res.status(500).json({error: 'Failed to update stock'});
  }
});

//save new Places Of Purchase
app.post('/placesOfPurchase', async (req, res) => {
  try {
    const {where, l} = req.body;
    if (!where || !l) {
      return res.status(400).json({error: 'All fields are required'});
    }
    const newplacesOfPurchase = new PlacesOfPurchaseInfo({
      where,
      l,
    });
    await newplacesOfPurchase.save();
    res.status(201).json(newplacesOfPurchase);
  } catch (error) {
    console.error('Save error', error.message, error); // Detailed error logging
    res.status(500).json({error: 'Failed to save Places Of Purchase'});
  }
});

// Save new Brand
app.post('/brand', async (req, res) => {
  const {g, name, ingredients} = req.body;

  // Log the received fields with detailed info
  console.log('Quantity:', g, 'Type:', typeof g);
  console.log('Name:', name, 'Type:', typeof name);
  console.log('Ingredients:', ingredients, 'Type:', typeof ingredients);

  if (typeof g === 'undefined' || g === null || g <= 0) {
    console.log('Invalid quantity field:', g);
    return res.status(400).json({error: 'Quantity field is required'});
  }
  if (typeof name === 'undefined' || name === null || name.trim() === '') {
    console.log('Invalid name field:', name);
    return res.status(400).json({error: 'Name field is required'});
  }
  if (
    typeof ingredients === 'undefined' ||
    ingredients === null ||
    ingredients.trim() === ''
  ) {
    console.log('Invalid ingredients field:', ingredients);
    return res.status(400).json({error: 'Ingredients field is required'});
  }

  try {
    const newBrand = new BrandInfo({
      g,
      name,
      ingredients,
    });

    await newBrand.save();
    console.log('Brand saved successfully:', newBrand);
    res.status(201).json(newBrand);
  } catch (error) {
    console.error('Save error:', error.message, error); // Detailed error logging
    res.status(500).json({error: 'Failed to save Brand'});
  }
});

// Save new ingredient
app.post('/ingredients', async (req, res) => {
  try {
    const {ingredient, g, brand, place} = req.body;
    if (
      !ingredient ||
      !g ||
      !brand ||
      !Array.isArray(place) ||
      place.length === 0
    ) {
      return res.status(400).json({error: 'All fields are required'});
    }

    // Validate each ingredient in the array
    for (const where of place) {
      if (!where.where || !where.l) {
        return res.status(400).json({
          error: 'Each place must have an where  and l ',
        });
      }
    }
    const newIngredient = new IngredientInfo({ingredient, g, brand, place});
    await newIngredient.save();
    res.status(201).json(newIngredient);
  } catch (error) {
    console.error('Save error', error.message, error); // Detailed error logging
    res.status(500).json({error: 'Failed to save ingredient'});
  }
});

//SearchPlacesOfPurchase section
app.get('/get-all-SearchPlacesOfPurchase', async (req, res) => {
  try {
    const data = await PlacesOfPurchaseInfo.find({});
    res.send({status: 'Ok', data: data});
  } catch (error) {
    console.error('Fetch error', error.message); // Log fetch errors
    res
      .status(500)
      .send({error: 'Failed to fetch data', details: error.message});
  }
});

//Ingredient section
app.get('/get-all-ingredient', async (req, res) => {
  try {
    const data = await IngredientInfo.find({});
    res.send({status: 'Ok', data: data});
  } catch (error) {
    console.error('Fetch error', error.message); // Log fetch errors
    res
      .status(500)
      .send({error: 'Failed to fetch data', details: error.message});
  }
});

//brand section
app.get('/get-all-brand', async (req, res) => {
  try {
    const data = await BrandInfo.find({});
    res.send({status: 'Ok', data: data});
  } catch (error) {
    console.error('Fetch error', error.message); // Log fetch errors
    res
      .status(500)
      .send({error: 'Failed to fetch data', details: error.message});
  }
});

//recipe section
app.get('/get-all-recipe', async (req, res) => {
  try {
    const data = await RecipeInfo.find({});
    res.send({status: 'Ok', data: data});
  } catch (error) {
    console.error('Fetch error', error.message); // Log fetch errors
    res
      .status(500)
      .send({error: 'Failed to fetch data', details: error.message});
  }
});

// Save new recipe
app.post('/recipe', async (req, res) => {
  try {
    const {name, ingredients, qpro} = req.body;

    // Validate the request body
    if (
      !name ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0 ||
      !qpro
    ) {
      return res.status(400).json({error: 'All fields are required'});
    }

    // Validate each ingredient in the array
    for (const ingredient of ingredients) {
      if (
        !ingredient.ingredient ||
        !ingredient.brand ||
        !ingredient.lg == null
      ) {
        return res.status(400).json({
          error: 'Each ingredient must have an ingredient name and gram amount',
        });
      }
    }

    // Check if a recipe with the same name already exists
    const existingRecipe = await RecipeInfo.findOne({name});
    if (existingRecipe) {
      return res
        .status(400)
        .json({error: 'A recipe with this name already exists'});
    }

    // Create a new recipe
    const newRecipe = new RecipeInfo({name, ingredients, qpro});
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error saving recipe:', error); // Log the detailed error
    res.status(500).json({error: 'An error occurred while saving the recipe'});
  }
});

// Delete a recipe entry
app.delete('/recipe/:id', async (req, res) => {
  try {
    const deletedRecipe = await RecipeInfo.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({error: 'Recipe entry not found'});
    }
    res.json({message: 'Recipe entry deleted successfully'});
  } catch (error) {
    console.error('Delete error', error.message, error); // Detailed error logging
    res.status(500).json({error: 'Failed to delete Recipe entry'});
  }
});

app.get('/recipe/:id', async (req, res) => {
  try {
    const recipe = await RecipeInfo.findOne({'ingredients._id': req.params.id});
    if (!recipe) {
      return res.status(404).json({error: 'Recipe not found'});
    }
    const ingredient = recipe.ingredients.find(
      ing => ing._id.toString() === req.params.id,
    );
    res.json({lg: ingredient.lg});
  } catch (error) {
    console.error('Fetch error', error.message);
    res.status(500).send({error: 'Failed to fetch recipe data'});
  }
});

// Save new Purchasing

app.post('/purchasings', async (req, res) => {
  try {
    const {ingredients, brand, p, where, date, l} = req.body;

    if (!ingredients || !brand || !p || !where || !date || !l) {
      return res.status(400).json({message: 'All fields are required'});
    }

    const newPurchasingInfo = new PurchasingInfo({
      ingredients,
      brand,
      p,
      where,
      date,
      l,
    });
    await newPurchasingInfo.save();

    res.status(201).json({
      message: 'Purchasing info saved successfully',
      data: newPurchasingInfo,
    });
  } catch (error) {
    console.error('Error saving purchasing info:', error);
    res
      .status(500)
      .json({message: 'Error saving purchasing info', error: error.message});
  }
});

// Delete a purchasing entry
app.delete('/purchasings/:id', async (req, res) => {
  try {
    const deletedPurchasing = await PurchasingInfo.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedPurchasing) {
      return res.status(404).json({error: 'Purchasing entry not found'});
    }
    res.json({message: 'Purchasing entry deleted successfully'});
  } catch (error) {
    console.error('Delete error', error.message, error); // Detailed error logging
    res.status(500).json({error: 'Failed to delete purchasing entry'});
  }
});

// Modified /get-all-purchasing route to include BrandInfo data
app.get('/get-all-purchasing', async (req, res) => {
  try {
    const purchasingData = await PurchasingInfo.find().lean();

    // Populate brand info for each purchasing data
    const populatedData = await Promise.all(
      purchasingData.map(async purchase => {
        const brand = await BrandInfo.findOne({name: purchase.brand}).lean();
        return {...purchase, brand};
      }),
    );

    res.status(200).json({status: 'Ok', data: populatedData});
  } catch (error) {
    console.error('Fetch error', error.message);
    res
      .status(500)
      .send({error: 'Failed to fetch data', details: error.message});
  }
});

// Ingredients list Section //
// Get all ingredients lists
app.get('/ingredients-lists', async (req, res) => {
  try {
    const lists = await IngredientsList.find({});
    res.json(lists);
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch ingredients lists'});
  }
});

// Save new ingredients list
app.post('/ingredients-lists', async (req, res) => {
  try {
    const {ingredients} = req.body;
    const newIngredientsList = new IngredientsList({ingredients});
    await newIngredientsList.save();
    res.status(201).json(newIngredientsList);
  } catch (error) {
    res.status(500).json({error: 'Failed to save ingredients list'});
  }
});

// Update an existing ingredients list
app.put('/ingredients-lists/:id', async (req, res) => {
  try {
    const {ingredients} = req.body;
    const updatedList = await IngredientsList.findByIdAndUpdate(
      req.params.id,
      {ingredients},
      {new: true},
    );
    if (!updatedList) {
      return res.status(404).json({error: 'Ingredients list not found'});
    }
    res.json(updatedList);
  } catch (error) {
    res.status(500).json({error: 'Failed to update ingredients list'});
  }
});

// Delete an ingredients list
app.delete('/ingredients-lists/:id', async (req, res) => {
  try {
    const deletedList = await IngredientsList.findByIdAndDelete(req.params.id);
    if (!deletedList) {
      return res.status(404).json({error: 'Ingredients list not found'});
    }
    res.json({message: 'Ingredients list deleted successfully'});
  } catch (error) {
    res.status(500).json({error: 'Failed to delete ingredients list'});
  }
});

app.listen(8083, () => {
  console.log('Node js server started.');
});
