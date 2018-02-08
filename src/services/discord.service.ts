import { DiscordMessage } from './../model/discord-message.model';
import { Client, Webhook, RichEmbed, Message, WebhookMessageOptions } from 'discord.js';
import { Api, IApi } from './../model/api.model';
import { Log } from './../model/log.model';

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

    public sendMessage(webhookID: string, message: WebhookMessageOptions): Promise<Message|Message[]> {
        return new Promise((resolve, reject) => {
            this.webhooks.find(webhook => webhook.name === webhookID)
                .sendMessage('', message)
                .then(msg => resolve(msg))
                .catch(err => Log.error(this.fileName, err));
        });
    }

    private async loadWebhooks() {
        this.webhooks = (await this.client.guilds.first().fetchWebhooks()).array();       
    }
    
}
