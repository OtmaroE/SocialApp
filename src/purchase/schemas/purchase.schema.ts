import * as mongoose from 'mongoose';

export const PurchaseSchema = new mongoose.Schema({
    userId: String,
    productId: String,
    created: Date,
    modified: Date,
});

PurchaseSchema.pre('save', function(next) {
    this.modified = new Date();
    next();
});
