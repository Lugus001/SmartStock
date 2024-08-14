import mongoose from 'mongoose';

const RecipeDetailSchema = new mongoose.Schema(
  {
    id: {type: Number, unique: true, default: () => Date.now()}, // Generate a unique id based on timestamp
    name: {type: String, required: true, unique: true},
    qpro: {type: Number, required: true},
    ingredients: [
      {
        ingredient: {type: String, required: true},
        brand: {type: String, required: true},
        lg: {type: Number, required: true}, // ingredients List gram = (lg)
      },
    ],
  },
  {
    collection: 'RecipeInfo',
  },
);

export const RecipeInfo = mongoose.model('RecipeInfo', RecipeDetailSchema);
