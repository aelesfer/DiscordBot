import { Log } from './log.model';
import { Document, Model, Schema, Mongoose, mongo } from 'mongoose';
import * as mongoose from 'mongoose';

export interface IGplusPost extends Document {
    id: string;
    title: string;
    url: string;
    published: Date;    
}

export interface IGplusPostModel extends Model<IGplusPost> {}

const schema = new Schema({
    id:         {type: String, required: true, unique: true},
    title:      {type: String, required: true},
    url:        {type: String, required: true},
    published:  {type: Date, required: true}
});

const GplusPost = mongoose.model<IGplusPost>('GplusPost', schema);
GplusPost.on('error', error => {
    Log.error('gplus-post.model.ts', 'Error al realizar una operación con este modelo');
    Log.error('gplus-post.model.ts', error);
});

export { GplusPost };
