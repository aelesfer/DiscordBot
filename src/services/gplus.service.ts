import { Log } from './../model/log.model';
import { Api, IApi } from './../model/api.model';
import { GplusCommunity, IGplusCommunity } from './../model/gplus-community.model';
import * as googleapis from 'googleapis';
import * as Moment from 'moment';

export class GplusService {

    private static gplusKey: string;
    private static dateFormat = 'YYYY/M/D';
    private static gplus = googleapis.plus('v1');
    private static fieldsToReturn = 'nextPageToken, items/id, items/title, items/url, items/object(attachments, content), items/actor(displayName, image), items/access(description)';
    
    public static async getCommunities(): Promise<IGplusCommunity[]> {
        return GplusCommunity.find({}).exec();
    }

    public static async getActivityFeed(community: IGplusCommunity): Promise<any> {
        const params = {
            query: undefined,
            fields: this.fieldsToReturn,
            maxResults: 20,
            orderBy: 'recent',
            pageToken: community.paginationToken,
            key: await this.getGplusKey()
        };
        params.query = 'community:' + community.id;
        params.query += ' after:' + Moment(community.processingDate).format(this.dateFormat);
        const posts = [];
        let makePetition = true;
        Log.trans('gplus.service.ts', 'Recuperando Activity Feed con query: ' + params.query);
        
        while (makePetition) {
            await new Promise((res, rej) => {
                this.gplus.activities.search(params, (err, response) => { 
                    if (err) {
                        rej();
                    } else {
                        const data = response.data;
                        params.pageToken = data.nextPageToken;
                        posts.push(...data.items);
                        makePetition = (data.items.length < 20) ? false : true;
                        res();
                    }
                });
            });
        }

        return posts;
    }
    
    private static async getGplusKey(): Promise<string> {
        if (!this.gplusKey) {
            this.gplusKey = (await Api.findOne({name: 'googleplus'})).key;
        }
        return this.gplusKey;
    }

}
