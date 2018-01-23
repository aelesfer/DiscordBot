import Webapp from './components/webapp';




const port = process.env.PORT || 3000;
const webapp = new Webapp();
webapp.start().listen(port);
