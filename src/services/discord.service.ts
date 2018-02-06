import { DiscordMessage } from './../model/discord-message.model';
import { Client, Webhook, RichEmbed } from 'discord.js';
import { Api, IApi } from './../model/api.model';
import { Log } from './../model/log.model';
import * as Striptags from 'striptags';

export class DiscordService {

    public fileName = 'DiscordService.ts';
    private apiName = 'discord';
    private token: String;
    private client: Client;
    private webhooks: Webhook[];

    constructor() {
        this.client = new Client();
    }

    public async load(): Promise<this> {
        Log.log(this.fileName, 'Iniciando DiscordService...');
        const api = <IApi>await Api.findOne({name: this.apiName}).lean().exec();
        await this.client.login(api.key);
        Log.log(this.fileName, '... cliente Discord cargado...');
        this.loadWebhooks();
        Log.log(this.fileName, 'DiscordService cargado con éxito');
        this.client.on('error', error => {
            Log.error(this.fileName, 'Error en el cliente de Discord');
            Log.error(this.fileName, error.message);
        });
        return this;
    }

    public sendMessage(webhookID: string, message: DiscordMessage): void {
        this.webhooks.find(webhook => webhook.name === webhookID)
            .sendMessage(this.messageToEmbed(message));
    }

    private async loadWebhooks() {
        this.webhooks = (await this.client.guilds.first().fetchWebhooks()).array();       
    }

    private messageToEmbed(message: DiscordMessage): RichEmbed {
        return new RichEmbed()
            .setURL(message.url)
            .setTitle(message.title)
            .setDescription(message.description)
            .setAuthor(message.author.name, message.author.icon_url)
            .setFooter(message.footer)
            .setThumbnail(message.image.url);
    }
}
