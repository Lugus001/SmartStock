import mongoose from 'mongoose';

const IngredientsListSchema = new mongoose.Schema({
  ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}],
  Gram: [{type: mongoose.Schema.Types.ObjectId, ref: 'Gram'}],

  // Add more fields as needed
});

export const IngredientsList = mongoose.model(
  'IngredientsList',
  IngredientsListSchema,
);
