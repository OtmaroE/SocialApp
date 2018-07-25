import * as mongoose from 'mongoose';
export const PaymentSchema = new mongoose.Schema({
    userId: String,
    amountPayed: Number,
    created: Date,
    modified: Date
});

PaymentSchema.pre('save', (next) => {
    this.modified = new Date();
    next();
});