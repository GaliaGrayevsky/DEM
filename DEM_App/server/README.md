# Service side implementation of DEM application
This is the implementation of the service side part of the DEM application.
This application was developed as a part of the final projects for my master degree.

The code can be found here (https://github.com/GaliaGrayevsky/DEM/tree/master/DEM_App/service)

## Development server

Run `npm start` / `npm run dem-app-server-start` for a dev server. 

This is node js product, run `npm install` for intial installation.

## Installation

This application uses https://www.npmjs.com/package/fluent-ffmpeg library. 
Please, follow this link to verify that you have all the required prerequistes (make sure you have ffmpeg installed on your system (including all necessary encoding libraries like libmp3lame or libx264) and you have set environment variables accordingly).

The application also assumed that you have installed gcloud console and updated the correspondant environment variable. 
If not, please, follow the steps in this link: https://cloud.google.com/speech-to-text/docs/quickstart-client-libraries

Once don and `npm install` completed you can start the server.

database/db.config.js file contains MYSQL database connection details.

