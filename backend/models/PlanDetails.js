import mongoose from 'mongoose';

const PlanDetailSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    qp: {type: Number, required: true}, // quantity of Product to plan
    qd: {type: Number, required: true}, // quantity of Demand to plan
    date: {type: Date, required: true},
  },
  {
    collection: 'PlanInfo',
  },
);

export const PlanInfo = mongoose.model('PlanInfo', PlanDetailSchema);
