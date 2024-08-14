import mongoose from 'mongoose';

const PurchasingDetailSchema = new mongoose.Schema(
  {
    ingredients: {type: String, required: true},
    brand: {type: String, required: true}, // Store brand name instead of reference
    p: {type: Number, required: true},
    where: {type: String, required: true},
    l: {type: Number, required: true}, // leadTime
    date: {type: Date, required: true},
  },
  {
    collection: 'PurchasingInfo',
  },
);

// Instance method to get order information
PurchasingDetailSchema.methods.getOrderInfo = async function () {
  return `${this.p} pack [Purchasing Order = ${this.brand}]`;
};

PurchasingDetailSchema.set('toJSON', {virtuals: true});
PurchasingDetailSchema.set('toObject', {virtuals: true});

export const PurchasingInfo = mongoose.model(
  'PurchasingInfo',
  PurchasingDetailSchema,
);
