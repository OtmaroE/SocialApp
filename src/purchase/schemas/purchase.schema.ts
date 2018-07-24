import * as mongoose from 'mongoose';

export const PurchaseSchema = new mongoose.Schema({
    userId: String,
    productId: String,
    created: Date,
    modified: Date
})