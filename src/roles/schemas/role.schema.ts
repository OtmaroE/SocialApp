import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const RoleSchema = new Schema({
    name: { type: String, required: true },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
});

RoleSchema.pre('save', function(next) {
    this.modified = new Date();
    next();
});
