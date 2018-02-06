import { Log } from './log.model';
import { Document, Model, Schema, Mongoose, mongo } from 'mongoose';
import * as mongoose from 'mongoose';

export interface IGplusPost extends Document {
    id: string;
    published: Date;
    // Non persisted properties
    title: string;
    url: string;
    actor: {
        name: string;
        url: string;
        image: string;
    };
    data: {
        description: string;
        image: string;
    };
}

export interface IGplusPostModel extends Model<IGplusPost> {
    fromApi(data: any): IGplusPost;
}

const schema = new Schema({
    id:         {type: String, required: true, unique: true},
    published:  {type: Date, required: true}
});
schema.static('fromApi', fromApi);

const GplusPost = mongoose.model<IGplusPost>('GplusPost', schema) as IGplusPostModel;
GplusPost.on('error', error => {
    Log.error('gplus-post.model.ts', 'Error al realizar una operación con este modelo');
    Log.error('gplus-post.model.ts', error);
});

function fromApi(data: any): IGplusPost {
    return new GplusPost(<IGplusPost>{
        id:         data.id,
        title:      data.title,
        url:        data.url,
        published:  data.pubished,
        actor: {
            name:   data.actor.displayName,
            url:    data.actor.url,
            image:  data.actor.image.url
        },
        data: {
            description: data.object.content,
            image:       data.object.attachments[0].image.url
        }
    });
}

export { GplusPost };
