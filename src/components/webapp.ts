import * as express from 'express';
import {Express} from 'express';


export default class Webapp {

    private express: Express;

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    public start(): Express {
        return this.express;
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.get('/', (req, res) => {
            console.log('Petición en este servidor. ?????');
            res.json({message: 'Da bot, men.'});
        });
        this.express.use('/', router);
    }
}
