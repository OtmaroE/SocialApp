import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const AccessTokenSchema = new Schema({
    jwtid: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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

AccessTokenSchema.pre('save', function(next) {
    this.modified = new Date();
    next();
});
