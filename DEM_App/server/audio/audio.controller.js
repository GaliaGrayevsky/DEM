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


  file_name = './' + env.RECORDING_DIR + '/' + file_name + '_full.wav';//'D:/DEM/DEM_App/server/Recordings/' + file_name + '_full.wav';
  console.log('!!!!!!!',file_name);

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
    languageCode: languageCode
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
  file_name = './' + env.RECORDING_DIR + '/' + file_name + '_full.wav';

  //let filesList = fs.readdirSync('./' + env.RT_CHUNKS_DIR + '/');   

  let filesList = await fs.readdirSync('./' + env.RT_CHUNKS_DIR + '/');
  
 
  filesList = filesList.map(function (fileName) {
      return {
        name: fileName,
        time: fs.statSync('./' + env.RT_CHUNKS_DIR + '/' + fileName).mtime.getTime()
      };
    })
    .sort(function (a, b) {
      return a.time - b.time; })
    .map(function (v) {
      console.log(v);
      return v.name; });
  

  console.log(filesList);

  let index = 0;
  //let tmpFileName = './' + env.RT_CHUNKS_DIR + '/' + tmp_file_name + index + '_tmp.wav';

  let ffmpegCmd = ffmpeg('./' + env.RT_CHUNKS_DIR + '/' + filesList[0])

  filesList.forEach((e,i) => {
    if (i>0 && i < filesList.length - 1){
      try {
        ffmpegCmd.input('./' + env.RT_CHUNKS_DIR + '/' + filesList[i]);
      } catch (e) {
        console.log('Bug in input!!!!', filesList[i]);
      }      
    }
  });

  ffmpegCmd.on('end', function() {
            console.log('Merging finished ! ');
            /** Remove all temporary stored files */
            fs.readdirSync('./' + env.RT_COMBINED_CHUNKS + '/').         
              forEach(file => fs.unlinkSync('./' + env.RT_COMBINED_CHUNKS + '/' + file));
            fs.readdirSync('./' + env.RT_CHUNKS_DIR + '/').         
              forEach(file => fs.unlinkSync('./' + env.RT_CHUNKS_DIR + '/' + file));

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



            client.longRunningRecognize(request).then(responses => {

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
          })
        .on('error', function(e) { console.log('Error!!!!!: ', e);})
        .mergeToFile(file_name);


  console.log('After merging!!!!!!!!!!');

}
