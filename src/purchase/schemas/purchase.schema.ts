import * as mongoose from 'mongoose';

export const PurchaseSchema = new mongoose.Schema({
    userId: String,
    productId: String,
    productName: String,
    pricePaid: Number,
    quantity: Number,
    created: {
        type: Date,
        default: Date.now,
    },
    modified: Date,
});
PurchaseSchema.pre('save', function(next) {
    this.modified = new Date();
    next();
});
