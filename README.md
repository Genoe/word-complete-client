# word-complete-client
Frond-end code for a Word-Complete (English Shiritori) game using the MERN stack
* A demo of the website can be seen here: [wordcompleteonline.com](https://wordcompleteonline.com). The website is hosted on an [AWS Lightsail](https://aws.amazon.com/lightsail/) server.
* The goal of this website is to make a simple realtime multiplayer game.
* On the frontend, [Bootstrap](https://getbootstrap.com/) and [React](https://reactjs.org/) are used. This website is meant to work well on both desktop and mobile.
* The repository for the backend can be found [here](https://github.com/Genoe/word-complete-server). On the backened, this project uses [Nodejs](https://nodejs.org/en/) with the [Express](https://expressjs.com/) web framework and [Socket.IO](https://socket.io/) for managing realtime communication over http polling or websockets. [MongoDB](https://www.mongodb.com/) is used for the database. [Nginx](https://www.nginx.com/) is used to handle https and forwarding traffic from port 80 to the Node application. Basic use of [PM2](http://pm2.keymetrics.io/) is used to monitor Node processes.
## Future Goals
* Redesign the Socket.IO/Websocket connection to work with multiple server instances. Almost certainly this will work by using a tool like Redis to exchange messages between instances.
* Add a time limit for responding to your opponent. This will quicken the pace and make it harder to cheat by using a dictionary. 
* Allow the user to look up the meaning of words.
* Allow the user to lookup words used in previous games
* Allow the user to play the game in English or Japanese
