//import { speech } from './speech';
const socketIO = require('socket.io');

// 3rd party modules.
const bodyParser = require("body-parser");
const jsonServer = require("json-server");

const ss = require('socket.io-stream');

// App modules.
const authTokenHttpRequestInterceptor = require("./http-interceptor/auth-token.http-request-interceptor");
//const mockDataHttpRequestInterceptor = require("./http-interceptor/mock-data.http-request-interceptor");
const authController = require("./auth/auth.controller");
const patientsController = require("./patients/patient.controller");
const testsController = require("./tests/test.controller");
const audioController = require("./audio/audio.controller");
const util = require("./util");
const config = require("./config.json");
const path = require('path');
const fs = require('fs');
const env = require('./env');
const speech = require('./speech');
speech.setupSpeech();

var ffmpeg = require('fluent-ffmpeg');

// Create the json-server
const server = jsonServer.create();

// Setup express request body parsing.
server.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(jsonServer.defaults());

// Add a security filter to intercept and inspect requests for valid tokens.
server.use(authTokenHttpRequestInterceptor.intercept);

// API routes.
server.use("/api/audio", audioController);
server.use("/api/tests", testsController);
server.use("/api/patients", patientsController);
server.use("/api/auth", authController);

// Start the server.
const serverInstance = server.listen(config.port, () => {
  //util.consoleReset();
  console.log(`----------------------------------------------------------------------`);
  console.log(`Running Auth API Server on: http://localhost:${config.port}`);
  console.log(`----------------------------------------------------------------------`);
  console.log("\n");

});

const io = socketIO(serverInstance);

io.on('connect', (client) => {
  var me = this;
  me.socketClient = client;
  console.log(`Client connected [id=${client.id}]`);
  client.emit('server_setup', `Server connected [id=${client.id}]`);

  //const audioFile = fs.createWriteStream('stream.wav', {end: false, flags: 'a'});

  // simple DF detectIntent call
  ss(client).on('stream-speech', function (stream, data) {
      
      // get the file name and open writestream
      let seq_num = data.seq_num;
      let filenameCurrent = './' + env.RT_CHUNKS_DIR + '/' + data.name + '_' + seq_num + '.wav';//path.basename();
      console.log('!!!!! Writing to chunk at:   ' + filenameCurrent);
      let audioFile = fs.createWriteStream(filenameCurrent, {end: false, flags: 'a'});
      
      // get the target language
      const targetLang = data.language;
      
      stream.pipe(audioFile);

      if (seq_num > 0) {

        let filePrevious = fs.createReadStream('./' + env.RT_CHUNKS_DIR + '/' + data.name + '_' + (seq_num-1) + '.wav');
        
        try{
          ffmpeg(filePrevious)
          .input(filenameCurrent)
          .on('end', function() {
            console.log('Merging finished !');
            let audioFile = fs.createReadStream('./' + env.RT_COMBINED_CHUNKS + '/' + data.name + '_' + (seq_num-1) + '_' + (seq_num) + '.wav');

            speech.speechStreamToText(audioFile, targetLang, data.name, seq_num, function(name, seq_num, transcribeObj){
              console.log('Trascript of: ', (seq_num-1) + '_' + (seq_num) + '.wav', ' :' , {
                                                                                              transcript: transcribeObj ? transcribeObj.transcript/* .replace(/[^123456789]/g, '') */ : 'אין נתונים',
                                                                                              seq_num_prev: seq_num-1,
                                                                                              seq_num_curr: seq_num
                                                                                            });
              me.socketClient.emit('transcript', {
                                                    transcript: transcribeObj ? transcribeObj.transcript/* .replace(/[^123456789]/g, '') */ : 'אין נתונים',
                                                    seq_num_prev: seq_num-1,
                                                    seq_num_curr: seq_num                                                      
                                                  }
                                                    
                                  );
            });
          })
          .on('error', function(e) { 
            console.log('Error!!!!!: ', e);
            filePrevious.close();

            console.log('Trascript of: ', (seq_num-1) + '_' + (seq_num) + '.wav', ' :' , {
              transcript:  'אין נתונים',
              seq_num_prev: seq_num-1,
              seq_num_curr: seq_num
            });

            me.socketClient.emit('transcript', {
                                                  transcript: 'אין נתונים',
                                                  seq_num_prev: seq_num-1,
                                                  seq_num_curr: seq_num                                                      
                                                }
            );
          })
          .mergeToFile('./' + env.RT_COMBINED_CHUNKS + '/' + data.name + '_' + (seq_num-1) + '_' + (seq_num) + '.wav');
        }
        catch(err) {
          console.log('Errors from the socket input !!!!!!!!!!!');
        }
        
      } 
    });
});