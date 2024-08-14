//define the schema for MongoDB collection
import mongoose from 'mongoose';

const PlacesOfPurchaseDetailSchema = new mongoose.Schema(
  {
    where: {type: String, required: true},
    l: {type: Number, required: true}, // leadTime
  },
  {
    collection: 'PlacesOfPurchaseInfo',
  },
);
export const PlacesOfPurchaseInfo = mongoose.model(
  'PlacesOfPurchaseInfo',
  PlacesOfPurchaseDetailSchema,
);
