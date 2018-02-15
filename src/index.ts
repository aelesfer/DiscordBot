import { GplusBot } from './components/gplus.bot';
import { GplusService } from './services/gplus.service';
import { DiscordMessage } from './model/discord-message.model';
import { DiscordService } from './services/discord.service';
import { Api } from './model/api.model';
import Webapp from './components/webapp';
import axios from 'axios';
import * as mongoose from 'mongoose';
import { Log } from './model/log.model';
import { GplusCommunity } from './model/gplus-community.model';

// Inicio de la aplicación web
const port = process.env.PORT || 3000;
const webapp = new Webapp();
webapp.start().listen(port);

// Programamos una peticion constante a Heroku para que no tire la aplicación
// TODO: Quitar esto
setInterval(() => {
    axios.get('http://roleando-online-bot.herokuapp.com');
  }, 900000);

// Conexión con la base de datos
mongoose.connect('mongodb://mongoadmin:Tharkun%245mlab@ds113098.mlab.com:13098/heroku_d08mjspf')
  .then(async() => {
    const discordService = await new DiscordService().load();
    new GplusBot(discordService).load(); })
  .catch(err => {
    Log.error('index.ts', 'Could not connect to MongoDB');
    Log.error('index.ts', err);
    process.exit();
  });

mongoose.connection.once('open', () => Log.log('index.ts', 'Conectado a la base de datos'));
