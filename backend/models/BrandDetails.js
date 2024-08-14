import mongoose from 'mongoose';

const BrandDetailSchema = new mongoose.Schema(
  {
    g: {type: Number, required: true},
    name: {type: String, required: true},
    ingredients: {type: String, required: true},
  },
  {
    collection: 'BrandInfo',
  },
);

export const BrandInfo = mongoose.model('BrandInfo', BrandDetailSchema);
