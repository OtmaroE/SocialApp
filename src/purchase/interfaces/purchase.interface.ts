import { Document } from 'mongoose';

export interface Purchase extends Document {
    readonly userId: String;
    readonly productId: String;
    readonly created: Date;
    readonly modified: Date;
}