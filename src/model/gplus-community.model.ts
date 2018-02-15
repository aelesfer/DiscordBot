import { Log } from './log.model';
import { Document, Model, Schema, Mongoose, mongo } from 'mongoose';
import * as mongoose from 'mongoose';

const fileName = 'gplus-community.model.ts';

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

const GplusCommunity = mongoose.model<IGplusCommunity>('GplusCommunity', schema) as IGplusCommunityModel;
GplusCommunity.on('error', error => {
    Log.error(fileName, 'Error al realizar una operación con este modelo');
    Log.error(fileName, error);
});

export { GplusCommunity };
