import * as mongoose from 'mongoose';

export const PurchaseSchema = new mongoose.Schema({
    userId: String,
    productId: String,
    productName: String,
    pricePaid: Number,
    created: Date,
    modified: Date
});
