import { DiscordMessage } from './../model/discord-message.model';
import { Client, Webhook, RichEmbed, Message, WebhookMessageOptions } from 'discord.js';
import { Api, IApi } from './../model/api.model';
import { LogService } from './log.service';

export class DiscordService {
    
    private apiName = 'discord';
    private token: String;
    private webhooks: Webhook[];
    private client: Client = new Client();
    private logService = new LogService('discord.service.ts');

    public async load(): Promise<this> {
        this.logService.log('Iniciando DiscordService...');
        try {
            const api = <IApi>await Api.findOne({name: this.apiName}).lean().exec();
            await this.client.login(api.key);
            this.logService.log('... cliente Discord cargado...');
            await this.loadWebhooks();
            this.logService.log('DiscordService cargado con éxito');
            this.client.on('error', error => {
                this.logService.error('Error en el cliente de Discord', error.message);
            });
        } catch (e) {
            this.logService.error('Error en la carga de DiscordService', e);
            throw e;
        }
        
        return this;
    }

    public sendMessage(webhookID: string, message: WebhookMessageOptions): Promise<Message|Message[]> {
        return this.webhooks.find(webhook => webhook.name === webhookID)
            .sendMessage('', message)
            .catch(err => { this.logService.error('Error al mandar mensaje a Discord', err); throw err; });
    }

    private async loadWebhooks() {
        this.webhooks = (await this.client.guilds.first().fetchWebhooks()).array();
        this.logService.log('... Webhooks del servidor cargados...');
    }
    
}
