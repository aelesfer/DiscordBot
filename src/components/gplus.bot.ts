import { GplusPost } from './../model/gplus-post.model';
import { IGplusCommunity, GplusCommunity } from './../model/gplus-community.model';
import { GplusService } from './../services/gplus.service';
import * as Moment from 'moment';
import * as Cron from 'node-cron';

export class GplusBot {

    private maxHistoryDate: string = Moment().subtract(4, 'days').format('YYYY/M/D');
    private scheduleFrequency = '*/1 * * * *';

    constructor() {}

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
                feed.forEach(post => this.processPost(post));
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
                feed.forEach(post => this.processPost(post));
            });
        });
    }

    private processPost(post: any) {
        // LOGICA A IMPLEMENTAR
        // 1. Recupera lista de pots, ya con sus datos
        // 2. Revisa si el ID o la URL ya existe en la BD (tal vez solo la url?)
        //      2.1. Si es un post reshared, revisar con la URL de data.object.url
        // 3. Si no existe, guarda el post en BD con la id y url correspondientes, y el estado "pending"
        // 4. Intenta enviarlo por discord. Si funciona pasa el estado a "sent", si no a "failed" (graba error?)
        GplusPost.findOne({id: post.id}).then(exists => {
            if (!exists) {
                const newPost = new GplusPost({});
                newPost.id = post.id;
                newPost.title = post.title + '.';
                newPost.url = post.url;
                newPost.published = Moment().toDate();
                newPost.save();
            }
        });
    }
}
