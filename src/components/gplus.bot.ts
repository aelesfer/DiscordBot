import { DiscordService } from './../services/discord.service';
import { DiscordMessage } from './../model/discord-message.model';
import { GplusPost, IGplusPost } from './../model/gplus-post.model';
import { IGplusCommunity, GplusCommunity } from './../model/gplus-community.model';
import { GplusService } from './../services/gplus.service';
import * as Moment from 'moment';
import * as Cron from 'node-cron';
import { WebhookMessageOptions } from 'discord.js';
import { LogService } from '../services/log.service';



export class GplusBot {

    private discordService: DiscordService;
    private logService = new LogService('gplus.bot.ts');

    constructor(discordService: DiscordService) {
        this.discordService = discordService;
    }

    public async load() {
        const maxHistoryDate: string = Moment().subtract(4, 'days').format('YYYY/M/D');
        const everyMinute = '*/1 * * * *';

        try {
            const communities = await GplusCommunity.find({}).exec();
            communities.forEach(async(community) => {
                community.processingDate = maxHistoryDate;
                await this.loadPosts(community);
                Cron.schedule(everyMinute, () => {
                    const today = Moment().format('YYYY/M/D');
                    community.processingDate = today;
                    this.loadPosts(community);
                });
            });
        } catch (err) {
            this.logService.error('Error loading GplusBot', err);
            throw err;
        }
    }

    private async processPosts(postsId: string[]) {
        postsId.forEach(async(postId) => {
            try {
                const existsInDb = await GplusPost.count({postId: postId}).exec() !== 0;
                if (!existsInDb) {
                    const post = await GplusService.getActivity(postId);
                    this.discordService.sendMessage('Test', post.toDiscordMessage())
                        .then(() => post.save())
                        .catch(err => this.logService.error('Error trying to send msg to Discord', err));
                }
            } catch (e) {
                this.logService.error('Error al procesar post');
            }
        });
    }

    private loadPosts(community: IGplusCommunity) {
        GplusService.getActivityFeed(community)
            .then(feed => this.processPosts(feed))
            .catch(err => {
                this.logService.error('Error al cargar los post de la comunidad ' + community.id, err);
                throw err;
            });
    }

}
