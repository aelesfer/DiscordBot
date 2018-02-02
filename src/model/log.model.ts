import * as mongoose from 'mongoose';

export interface ILog extends mongoose.Document {
    timestamp: Date;
    type: String;
    origin: String;
    message: String;
}

export interface ILogModel extends mongoose.Model<ILog> {
    log(origin: string, msg: string): void;
    error(origin: string, msg: string): void;
    trans(origin: string, msg: string): void;
}

const schema = new mongoose.Schema({
    timestamp: {type: Date, default: Date.now},
    type: String,
    origin: String,
    message: String
    })
    .static('log', (origin: string, msg: string) => {
        createLog('LOG', origin, msg).save();
    })
    .static('error', (origin: string, msg: string) => {
        createLog('ERROR', origin, msg).save();
    })
    .static('trans', (origin: string, msg: string) => {
        createLog('TRANS', origin, msg).save();
    });

export const Log = mongoose.model<ILog>('Log', schema) as ILogModel;

function createLog(type: string, origin: string, msg: string): mongoose.Document {
    const log = new Log();
    log.type = type;
    log.origin = origin;
    log.message = msg;
    console.log(log.type + ' ' + log.origin + ' ' + log.message);
    return log;
}
