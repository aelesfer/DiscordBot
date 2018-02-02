import { Log } from './log.model';
import { Document, Model, Schema, Mongoose, mongo } from 'mongoose';
import * as mongoose from 'mongoose';

export interface IGplusCommunity extends Document {
    id: string;
    name: string;
    processingDate: string;
    paginationToken: string;
}

export interface IGplusCommunityModel extends Model<IGplusCommunity> {}

const schema = new Schema({
    id:     {type: String, required: true},
    name:   {type: String, required: true}
});
schema.virtual('processingDate')
    .set(function(date: string) { this._processingDate = date; })
    .get(function() { return this._processingDate; });
schema.virtual('paginationToken')
    .set(function(token: string) { this._paginationToken = token; })
    .get(function() { return this._paginationToken; });

const GplusCommunity = mongoose.model<IGplusCommunity>('GplusCommunity', schema);
GplusCommunity.on('error', error => {
    Log.error('gplus-community.model.ts', 'Error al realizar una operación con este modelo');
    Log.error('gplus-community.model.ts', error);
});

export { GplusCommunity };
