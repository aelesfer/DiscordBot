# DiscordBot
Bot para discord usado en el canal RoleandoOnline.


## Variables de configuración
Este bot, actualmente desplegado en Heroku, requiere recuperar las claves privadas de los distintos APIs a los que accede, de variables de entorno. En esta lista se encuentran las variables que han de crearse, con el nombre necesario:

DISCORDBOT_MONGODB

## API Keys
Este bot utiliza conecta con distintas apis, y por lo tanto necesita tokens para conectar con ellas. Con el objetivo de  evitar almacenar estas claves en código que puede ser público, se leen de la propia base de datos a la que se conecte. 
Para crear las claves previamente en la base de datos, revisar el modelo en ```./src/model/api.model.ts```.
Para buscar el nombre con el que se tiene que almacenar cada API, revisar los distintos archivos en ```./src/service/```.

