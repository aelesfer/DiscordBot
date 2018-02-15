// API model stands for external API's like Youtube, Discord, or Google+ APIs, not this own application API
import { Document, Model, Schema } from 'mongoose';
import * as mongoose from 'mongoose';

export interface IApi extends Document {
    name: string;
    key: string;
}

interface IApiModel extends Model<IApi> {}

const schema = new Schema({
    name: {type: String, required: true },
    key: {type: String, required: true }
});

export const Api = mongoose.model<IApi>('Api', schema) as IApiModel;
