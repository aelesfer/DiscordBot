import Webapp from './components/webapp';
import axios from 'axios';

// Inicio de la aplicación web
const port = process.env.PORT || 3000;
const webapp = new Webapp();
webapp.start().listen(port);

// Programamos una peticion constante a Heroku para que no tire la aplicación
setInterval(() => {
    axios.get('http://roleando-online-bot.herokuapp.com');
  }, 900000);
