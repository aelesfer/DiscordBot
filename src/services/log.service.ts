import { Log } from '../model/log.model';

export class LogService {
    private fileName: string;

    constructor(name: string) {
        if (!name || name.trim() === '') {
            throw new Error('Loggable classses should contruct with a file name');
        }
        this.fileName = name;
    }

    log(msg: string, obj?: any) {
        Log.log(this.fileName, msg);
        if (obj) {
            Log.log(this.fileName, obj);
        }
    }
    trans(obj: any) {
        Log.trans(this.fileName, obj);
    }
    error(msg: string, obj?: any) {
        Log.error(this.fileName, msg);
        if (obj) {
            Log.error(this.fileName, obj);
        }
    }
}
