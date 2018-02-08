import { Log } from './log.model';
import { Document, Model, Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { Post } from './post.model';
import { DiscordMessage } from './discord-message.model';
import * as Striptags from 'striptags';
import * as HtmlEntities from 'html-entities';

const HtmlTranslator = new HtmlEntities.XmlEntities();

export interface IGplusPost extends DiscordMessage, Post, Document { 
    // Non persisted properties
    // Methods
    toDiscordMessage(): DiscordMessage;
}

interface GplusPostModel extends Model<IGplusPost> {
    fromApi(data: any): IGplusPost;
}

const GplusPostSchema = new Schema({
    postId: {type: String, required: true, unique: true},
    created: {type: String, required: true, default: Date.now},
    status: {type: String, enum: ['pending', 'processed', 'failed']}
});
GplusPostSchema.static('fromApi', fromApi)
    .method('addField', DiscordMessage.prototype.addField)
    .method('attachFile', DiscordMessage.prototype.attachFile)
    .method('setAuthor', DiscordMessage.prototype.setAuthor)
    .method('setColor', DiscordMessage.prototype.setColor)
    .method('setDescription', DiscordMessage.prototype.setDescription)
    .method('setFooter', DiscordMessage.prototype.setFooter)
    .method('setImage', DiscordMessage.prototype.setImage)
    .method('setThumbnail', DiscordMessage.prototype.setThumbnail)
    .method('setTimestamp', DiscordMessage.prototype.setTimestamp)
    .method('setTitle', DiscordMessage.prototype.setTitle)
    .method('setURL', DiscordMessage.prototype.setURL)
    .method('toDiscordMessage', function(): DiscordMessage {
        return new DiscordMessage(this);
    });

const GplusPost = mongoose.model<IGplusPost>('GplusPost', GplusPostSchema) as GplusPostModel;
GplusPost.on('error', error => {
    Log.error('gplus-post.model.ts', 'Error al realizar una operación con este modelo');
    Log.error('gplus-post.model.ts', error);
});

function fromApi(data: any): IGplusPost {
    const post: IGplusPost = new GplusPost();
    let title = removeHtml(data.title);
    let desc = removeHtml(data.object.content);
    if (title.replace(/\s/g, '') === desc.replace(/\s/g, '')) {
        desc = '';
    }
    title = (title.length > 60) ? title.substring(0, 59) + '...' : title;
    desc = (desc.length > 260) ? desc.substring(0, 259) + '...' : desc;
    post.postId = data.id;
    post.setTitle(title)
        .setURL(data.url)
        .setAuthor(data.actor.displayName, data.actor.image.url, data.actor.url)
        .setDescription(desc);
    if (data.object.attachments) {
        const thumb = data.object.attachments.find(attachm => attachm.image !== undefined);
        post.setImage((thumb) ? thumb.image.url : undefined);
    }
    return post;
}

function removeHtml(data: string): string {
    let returnData = HtmlTranslator.decode(data);
    returnData = Striptags(returnData);
    returnData = returnData.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    return returnData;        
}

export { GplusPost };
