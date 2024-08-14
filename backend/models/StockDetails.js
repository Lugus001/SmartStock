import mongoose from 'mongoose';

// Define the Stock schema
const StockDetailSchema = new mongoose.Schema(
  {
    ingredient: {type: String, required: true},
    brand: {type: String, required: true},
    g: {type: Number, required: true}, // in stock Product
    date: {type: Date, required: true},
  },
  {
    collection: 'StockInfo',
  },
);

export const StockInfo = mongoose.model('StockInfo', StockDetailSchema);
