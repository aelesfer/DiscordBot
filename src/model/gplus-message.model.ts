import { DiscordMessage } from './discord-message.model';
import * as Striptags from 'striptags';

export class GplusMessage extends DiscordMessage {

    constructor(data: any) {
        super();
        this.setAuthor(data.actor.displayName, data.actor.image.url)
            .setTitle(data.title)
            .setDescription(Striptags(data.object.content))
            .setUrl(data.url);
    }
}
