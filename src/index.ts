import { DiscordMessage } from './model/discord-message.model';
import { DiscordService } from './services/discord.service';
import { Api } from './model/api.model';
import Webapp from './components/webapp';
import axios from 'axios';
import * as mongoose from 'mongoose';
import { Log } from './model/log.model';

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
mongoose.connect(process.env.DISCORDBOT_MONGODB);

mongoose.connection.on('error', error => console.log(error));
mongoose.connection.once('open', () => console.log('connectada'));
