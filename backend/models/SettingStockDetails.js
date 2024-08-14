import mongoose from 'mongoose';

const SettingStockDetailSchema = new mongoose.Schema(
  {
    percentage: {type: Number, required: true},
  },
  {
    collection: 'SettingStockInfo',
  },
);

export const SettingStockInfo = mongoose.model(
  'SettingStockInfo',
  SettingStockDetailSchema,
);
