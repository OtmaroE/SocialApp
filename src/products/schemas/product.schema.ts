import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const ProductSchema = new Schema({
    name: String,
    price: Number,
    brand: String,
    created: Date,
    modified: Date,
});
