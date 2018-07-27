import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const RoleMappingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
    },
    created: {
        type: Date,
        default: Date.now,
    },
    modified: {
        type: Date,
        default: Date.now,
    },
});

RoleMappingSchema.pre('save', function(next) {
    this.modified = new Date();
    next();
});
