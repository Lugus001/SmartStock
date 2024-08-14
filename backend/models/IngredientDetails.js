// IngredientDetails.js

import mongoose from 'mongoose';

const IngredientDetailSchema = new mongoose.Schema(
  {
    ingredient: {type: String, required: true},
    g: {type: Number, required: true},
    brand: {type: String, required: true},
    place: [
      {
        where: {type: String, required: true},
        l: {type: Number, required: true},
      },
    ],
  },
  {
    collection: 'IngredientInfo',
  },
);

export const IngredientInfo = mongoose.model(
  'IngredientInfo',
  IngredientDetailSchema,
);
