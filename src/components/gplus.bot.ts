import { DiscordService } from './../services/discord.service';
import { DiscordMessage } from './../model/discord-message.model';
import { GplusPost } from './../model/gplus-post.model';
import { IGplusCommunity, GplusCommunity } from './../model/gplus-community.model';
import { GplusService } from './../services/gplus.service';
import * as Moment from 'moment';
import * as Cron from 'node-cron';

export class GplusBot {

    private maxHistoryDate: string = Moment().subtract(4, 'days').format('YYYY/M/D');
    private scheduleFrequency = '*/1 * * * *';
    private discordService: DiscordService;

    constructor(discordService: DiscordService) {
        this.discordService = discordService;
    }

    public async load(): Promise<any> {
        (await GplusCommunity.find({}).exec())
            .forEach(async(community) => {
                await this.loadOldCommunityPosts(community);
                this.createLoadCron(community);
            });   
    }

    private loadOldCommunityPosts(community: IGplusCommunity): Promise<any>{
        community.processingDate = this.maxHistoryDate;
        return new Promise((res, rej) => {
            GplusService.getActivityFeed(community).then(feed => {
                this.processPosts(feed);
                res();
            });
        });
        
    }

    private createLoadCron(community: IGplusCommunity): void {
        Cron.schedule(this.scheduleFrequency, () => {
            const today = Moment().format('YYYY/M/D');
            if (community.processingDate !== today) {
                community.processingDate = today;
            }
            GplusService.getActivityFeed(community).then(feed => {
                this.processPosts(feed);
            });
        });
    }

    private async processPosts(postsId: string[]) {
        (await Promise.all(postsId.map(postId => GplusService.getActivity(postId))))
            .forEach(async post => {
                if (await GplusPost.count({id: post.id}).exec() === 0) {
                    const message = new DiscordMessage()
                        .setAuthor(post.actor.name, post.actor.url, post.actor.image)
                        .setDescription(post.data.description)
                        .setImage(post.data.image)
                        .setTitle(post.title)
                        .setUrl(post.url);
                    this.discordService.sendMessage('Gplus', message);
                    // Procesar en discord
                    post.save();
                }
            });
    }
}
