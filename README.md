# Draw That Paper

Draw That Paper is a game of drawing and guessing, inspired by Pictionary.


## Prerequisites & Installing

First, you can test the game without installing anything through the following link : https://drawthatpaper.istic.univ-rennes1.fr/

### Prerequisites

To launch the game, you'll need to have NodeJS and npm installed on your computer.<br/>
If it's not the case, you can download it here : https://nodejs.org/en/<br/>
Note: npm is distributed with NodeJS so don't worry.

### Installing (frontend)

Please note that the frontend connects to our server by default. Read further (Configuration) for more information regarding this.

1 - Download the project from the GitHub interface (or here https://github.com/dbllt/oci_drawthatpaper/archive/main.zip)<br/>
You can also clone the project from any terminal :
    ```
    git clone https://github.com/dbllt/oci_drawthatpaper.git
    ```
<br/><br/>
2 - Extract the project if it's needed.

3 - Open a terminal into ```oci_drawthatpaper/dtp-front```.

4 - Run the following command : ```npm install``` if it hasn't been done before, then run ```npm run serve```.

5 - Once the development server is launched and compiled without any issue, open your web browser and enter the URL next to
the field "Local:". It should look like this : ```http://localhost:XXXX```.

6 - You can now play the game !

### Installing (backend)

First, you have to install MySQL and create a user and database for the service.

Then, import `dtp-back/database/database_schema.sql` into the database you just created.

Inside `dtp-back`, create a file called `.env` with the following lines:
```
PORT=3000
DATABASE_URL=localhost
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
NODE_ENV=development
ACCESS_TOKEN_EXPIRATION_TIME=3600000
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```

Complete the missing variables. Both `TOKEN_SECRET`s should be random strings that you keep secret.

Now install the dependencies using `npm install` and you should be good to go.

Use `node server.js` to run the server. It should be running on `http://localhost:3000`, you can then configure the frontend to use it.

### Configuration

By default, the front will connect to our server, at https://drawthatpaper.istic.univ-rennes1.fr/.

This URL is defined at the end of `dtp-front/src/networks/constants.js`.
Please change both `server_url` and `socket_url`, and do not include `/api` when running in dev mode.

## Authors

* **Allan Vixel**
* **Dorian Bouillet**
* **Lisa Gernez**
* **Maxime Beucher**
* **Nils Richard**



