import { Log } from './../model/log.model';
import { DiscordService } from './../services/discord.service';
import { DiscordMessage } from './../model/discord-message.model';
import { GplusPost, IGplusPost } from './../model/gplus-post.model';
import { IGplusCommunity, GplusCommunity } from './../model/gplus-community.model';
import { GplusService } from './../services/gplus.service';
import * as Moment from 'moment';
import * as Cron from 'node-cron';
import { WebhookMessageOptions } from 'discord.js';



export class GplusBot {

    private discordService: DiscordService;

    constructor(discordService: DiscordService) {
        this.discordService = discordService;
    }

    public async load() {
        const maxHistoryDate: string = Moment().subtract(4, 'days').format('YYYY/M/D');
        const everyMinute = '*/1 * * * *';
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
    }

    private async processPosts(postsId: string[]) {
        postsId.forEach(async(postId) => {
            const existsInDb = await GplusPost.count({postId: postId}).exec() !== 0;
            if (!existsInDb) {
                const post = await GplusService.getActivity(postId);
                this.discordService.sendMessage('Test', post.toDiscordMessage())
                    .then(() => post.save())
                    .catch(err => Log.error('gplus.bot.ts', err));
            }
        });
    }

    private async loadPosts(community: IGplusCommunity) {
        const feed = await GplusService.getActivityFeed(community);
        this.processPosts(feed);
    }

}
