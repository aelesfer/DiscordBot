import { Log } from './log.model';
import { Document, Model, Schema, Mongoose, mongo } from 'mongoose';
import * as mongoose from 'mongoose';

export interface IGplusCommunity extends Document {
    id: string;
    name: string;
    processDate: string;
    paginationToken: string;
}

export interface IGplusCommunityModel extends Model<IGplusCommunity> {}

const schema = new Schema({
    id:                 {type: String, required: true},
    name:               {type: String, required: true},
    processDate:        {type: String, required: true},
    paginationToken:    {type: String, required: false}
});

const GplusCommunity = mongoose.model<IGplusCommunity>('GplusCommunity', schema);
GplusCommunity.on('error', error => {
    Log.error('gplus-community.model.ts', 'Error al realizar una operación con este modelo');
    Log.error('gplus-community.model.ts', error);
});

export { GplusCommunity };
