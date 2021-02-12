const express = require("express");
const router = express.Router();
const httpStatus = require("http-status");
const requestHTTP = require('request');

const util = require("../util");

// Define the list of patients routes and matching handler methods.
router.post("/uploadAndTranscribeAudio", uploadAndTranscribeAudio);
router.post("/combineAndTranscribeRecordedAudio", combineAndTranscribeRecordedAudio);
// Export the routes defined here in this controller to the main server setup.
module.exports = router;

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');

const env = require('../env');

const { getAudioDurationInSeconds } = require('get-audio-duration');

var ffmpeg = require('fluent-ffmpeg');

// Handles failed requests.
function invalidRequest(res) {
  const message = `Cannot process the request. ${httpStatus["400_MESSAGE"]}`;
  console.log(`Request faild( ${message} )`);
  return util.createErrorResponse(res, httpStatus.BAD_REQUEST, message);
}

// Faild attempt to retrieve the data
function faildResponce(res) {
  const message = `Cannot process the responce. ${httpStatus["400_MESSAGE"]}`;
  console.log(`Responce faild( ${message} )`);
  return util.createErrorResponse(res, httpStatus._MESSAGE, message);
}

// Handles the requests that attempt to get list of patients of the givven doctor
async function uploadAndTranscribeAudio(req, res, next) {
  console.log('Got to uploadAndTranscribeAudio: ');
  
  let file_context = null;
  let languageCode = null;
  let file_name = null;

  try {
    file_context = req.body.file_context;
    file_name = req.body.file_name;
    languageCode = req.body.languageCode;
    //console.log(file_context, languageCode);

    if(!file_context || !languageCode || !file_name) {
      invalidRequest(res);
      return;
    }
  } catch (err) {
    console.log(err);
    invalidRequest(res);
    return;
  }


  file_name = 'C:/Users/galia/Downloads/DEMApp/DEMApp/DEM_App/server/' + file_name + '_full.wav';

  fs.writeFileSync(file_name, Buffer.from(file_context.replace('data:audio/wav;base64,', ''), 'base64'), function (err) {
    if (err) return console.log(err);
  });

  let file_duration = 0;
  /** Calculate duration of the file */
  getAudioDurationInSeconds(file_name).then((duration) => {
    console.log('Duration of the file: ', duration);
    file_duration = duration;
  });

  // Creates a client
  const client = new speech.v1.SpeechClient();

  const config = {
    encoding: env.SPEECH_ENCODING,
    sampleRateHertz: env.SAMPLE_RATE_HERZ,
    languageCode: languageCode,
  };
  

  /**
   * Note that transcription is limited to 60 seconds audio.
   * Use a GCS file for audio longer than 1 minute.
   */

  let test = fs.readFileSync(file_name).toString('base64');

  const audio = {
    content: test
  };

  const request = {
    config: config,
    audio: audio,
  };

  

  client.longRunningRecognize(request)
  .then(responses => {

      const [operation, initialApiResponse] = responses;

      // Adding a listener for the "complete" event starts polling for the
      // completion of the operation.
      operation.on('complete', (result, metadata, finalApiResponse) => {
        let transcription = result.results[0].alternatives[0].transcript;
        console.log('complete: ', transcription);
        util.createSuccessResponse(res, { 
                                          transcript: transcription,
                                          duration: file_duration
                                        }  
                                  ); 
      });
  
      // Adding a listener for the "progress" event causes the callback to be
      // called on any change in metadata when the operation is polled.
      operation.on('progress', (metadata, apiResponse) => {
        console.log('progress: ', metadata);
      });
  
      // Adding a listener for the "error" event handles any errors found during polling.
      operation.on('error', err => {
         util.createErrorResponse(res, err); 
         throw(err);
      });
  })
  .catch(err => {
      console.error("transcript error", err);
  });
  
}

// Handles the requests that attempt to get list of patients of the givven doctor
async function combineAndTranscribeRecordedAudio(req, res, next) {
  console.log('Got to combineAndTranscribeRecordedAudio: ');
  
  let languageCode = null;
  let file_name = null;

  try {
    file_name = req.body.file_name;
    languageCode = req.body.languageCode;
    //console.log(file_context, languageCode);

    if(!languageCode || !file_name) {
      invalidRequest(res);
      return;
    }
  } catch (err) {
    console.log(err);
    invalidRequest(res);
    return;
  }

  let tmp_file_name = file_name;
  file_name = 'C:/Users/galia/Downloads/DEMApp/DEMApp/DEM_App/server/' + file_name + '_full.wav';

  fs.readdirSync('C:/Users/galia/Downloads/DEMApp/DEMApp/DEM_App/server/').
          sort().          
          forEach(file => {
            console.log(file);
            if ((file.indexOf(tmp_file_name)>=0) && (file.split('_').length == 2) && (file.indexOf('full') == -1)){
              console.log(file);
              
            } else {

            }
          });


  let file_duration = 0;
  /** Calculate duration of the file */
  getAudioDurationInSeconds(file_name).then((duration) => {
    console.log('Duration of the file: ', duration);
    file_duration = duration;
  });

  // Creates a client
  const client = new speech.v1.SpeechClient();

  const config = {
    encoding: env.SPEECH_ENCODING,
    sampleRateHertz: env.SAMPLE_RATE_HERZ,
    languageCode: languageCode,
  };
  

  /**
   * Note that transcription is limited to 60 seconds audio.
   * Use a GCS file for audio longer than 1 minute.
   */

  let test = fs.readFileSync(file_name).toString('base64');

  const audio = {
    content: test
  };

  const request = {
    config: config,
    audio: audio,
  };

  

  client.longRunningRecognize(request)
  .then(responses => {

      const [operation, initialApiResponse] = responses;

      // Adding a listener for the "complete" event starts polling for the
      // completion of the operation.
      operation.on('complete', (result, metadata, finalApiResponse) => {
        let transcription = result.results[0].alternatives[0].transcript;
        console.log('complete: ', transcription);
        util.createSuccessResponse(res, { 
                                          transcript: transcription,
                                          duration: file_duration
                                        }  
                                  ); 
      });
  
      // Adding a listener for the "progress" event causes the callback to be
      // called on any change in metadata when the operation is polled.
      operation.on('progress', (metadata, apiResponse) => {
        console.log('progress: ', metadata);
      });
  
      // Adding a listener for the "error" event handles any errors found during polling.
      operation.on('error', err => {
         util.createErrorResponse(res, err); 
         throw(err);
      });
  })
  .catch(err => {
      console.error("transcript error", err);
  });
  
}
