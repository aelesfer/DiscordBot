import { Log } from './log.model';
import { Document, Model, Schema, Mongoose, mongo } from 'mongoose';
import * as mongoose from 'mongoose';
import * as Striptags from 'striptags';

export interface IDiscordMessage extends Document {
    webhookName: string;
    url: string;
    title: string;
    status: 'pending' | 'sent' | 'failed';
    description?: string;
    author?: {name: string, thumbnail?: string};
    footer?: string;
    thumbmail?: string;
    setWebhookName(name: string): this;
    setUrl(url: string): this;
    setTitle(title: string): this;
    setDescription(description: string): this;
    setAuthor(author: {name: string, thumbnail?: string}): this;
    setFooter(footer: string): this;
    setThumbnail(thumbnail: string): this;
}

export interface IDiscordMessageModel extends Model<IDiscordMessage> {}

const authorSchema = new Schema({
    name: {type: String, required: true},
    thumbnail: {type: String, required: false}
});

const schema = new Schema({
    webhookName: {type: String, required: true},
    url:            {type: String, required: true},
    title:          {type: String, required: true, set: title => Striptags(title).substring(0, 80)},
    status:         {type: String, required: true, enum: ['pending', 'sent', 'failed'], default: 'pending'},
    description:    {type: String, set: desc => Striptags(desc).substring(0, 300)},
    author: {
        name:       {type: String, required: true},
        thumbnail:  {type: String, required: false}
    },
    footer: String,
    thumbnail: String
    })
    .method('setWebhookName', function(name: string): IDiscordMessageModel {
        this.webhookName = name;
        return this;
    })
    .method('setUrl', function(url: string): IDiscordMessageModel {
        this.url = url;
        return this;
    })
    .method('setTitle', function(title: string): IDiscordMessageModel {
        this.title = title;
        return this;
    })
    .method('setDescription', function(description: string): IDiscordMessageModel {
        this.description = description;
        return this;
    })
    .method('setAuthor', function(author: string): IDiscordMessageModel {
        this.author = author;
        return this;
    })
    .method('setFooter', function(footer: string): IDiscordMessageModel {
        this.footer = footer;
        return this;
    })
    .method('setThumbnail', function(thumbnail: string): IDiscordMessageModel {
        this.thumbnail = thumbnail;
        return this;
    });
    
const DiscordMessage = mongoose.model<IDiscordMessage>('DiscordMessage', schema);
DiscordMessage.on('error', error => {
    Log.error('DiscordMessageModel.ts', 'Error al realizar una operación con este modelo');
    Log.error('DiscordMessageModel.ts', error);
});

export { DiscordMessage  };
// export const DiscordMessage = mongoose.model<IDiscordMessage>('DiscordMessage', schema) as IDiscordMessageModel;



