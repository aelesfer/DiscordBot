import { Client, Webhook, RichEmbed } from 'discord.js';
import { IDiscordMessage } from './../model/discord-message.model';
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

    public sendMessage(message: IDiscordMessage): void {
        message.save().then(sentMsg => {
            Log.trans(this.fileName, 'Mensaje creado en la cola. ID: ' + sentMsg._id);
            this.webhooks.find(webhook => webhook.name === message.webhookName)
                .sendMessage(this.messageToEmbed(message))
                .then(
                    mes => sentMsg.update({status: 'sent'}),
                    error => sentMsg.update({status: 'failed'})); 
        });
    }

    private async loadWebhooks() {
        this.webhooks = (await this.client.guilds.first().fetchWebhooks()).array();       
    }

    private messageToEmbed(message: IDiscordMessage): RichEmbed {
        return new RichEmbed()
            .setURL(message.url)
            .setTitle(message.title)
            .setDescription(message.description)
            .setAuthor(message.author.name, message.author.thumbnail)
            .setFooter(message.footer)
            .setThumbnail(message.thumbmail);
    }
}
