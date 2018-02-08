import { GplusPost, IGplusPost } from './../model/gplus-post.model';
import { Log } from './../model/log.model';
import { Api, IApi } from './../model/api.model';
import { GplusCommunity, IGplusCommunity } from './../model/gplus-community.model';
import * as googleapis from 'googleapis';
import * as Moment from 'moment';

export class GplusService {

    private static gplusKey: string;
    private static dateFormat = 'YYYY/M/D';
    private static gplus = googleapis.plus('v1');
    private static fieldsToReturn = 'url, id, title, published, actor(displayName, url, image), object(content, attachments)';
    
    public static async getCommunities(): Promise<IGplusCommunity[]> {
        return GplusCommunity.find({}).exec();
    }

    public static async getActivityFeed(community: IGplusCommunity): Promise<string[]> {
        const params = {
            query: undefined,
            fields: 'nextPageToken, items/id, items/object(id), items/verb',
            maxResults: 20,
            orderBy: 'recent',
            pageToken: community.paginationToken,
            key: await this.getGplusKey()
        };
        params.query = 'community:' + community.id;
        params.query += ' after:' + community.processingDate;
        const posts: string[] = [];
        let makePetition = true;
        Log.trans('gplus.service.ts', 'Recuperando Activity Feed con query: ' + params.query);
        
        while (makePetition) {
            await new Promise((res, rej) => {
                this.gplus.activities.search(params, (err, response) => { 
                    if (err) {
                        rej(err);
                    } else {
                        const data = response.data;
                        params.pageToken = data.nextPageToken;
                        makePetition = (data.items.length < 20) ? false : true;
                        data.items.map(post => (post.verb === 'post') ? post.id : post.object.id)
                            .forEach(postId => posts.push(postId));
                        res();
                    }
                });
            });
        }

        return posts;
    }

    public static async getActivity(activityId: string): Promise<IGplusPost>{
        const params = {
            activityId: activityId,
            fields: this.fieldsToReturn,
            key: await this.getGplusKey()
        };
        return new Promise<IGplusPost>((res, rej) => {
            this.gplus.activities.get(params, (err, response) => {
                if (err) {
                    rej(err);
                } else {
                    res(GplusPost.fromApi(response.data));
                }
            });
        });
    }
    
    private static async getGplusKey(): Promise<string> {
        if (!this.gplusKey) {
            this.gplusKey = (await Api.findOne({name: 'googleplus'})).key;
        }
        return this.gplusKey;
    }

}
