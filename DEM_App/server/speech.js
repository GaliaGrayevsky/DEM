const speechToText = require('@google-cloud/speech').v1p1beta1;
const env = require('./env');

module.exports = {
    encoding: env.SPEECH_ENCODING,
    sampleRateHertz: env.SAMPLE_RATE_HERZ,
    ssmlGender: env.SSML_GENDER,
    stt: null,
    sttRequest: null,
      
    setupSpeech: function(){
        this.stt = new speechToText.SpeechClient();
        this.sttRequest = {
            config: {
              sampleRateHertz: this.sampleRateHertz,
              encoding: this.encoding,
              enableAutomaticPunctuation: true,
              //enableSpeakerDiarization: true,
              //diarizationSpeakerCount: 2,
              useEnhanced: true,
              recordProgram: 'rec',
              model: 'default',
              metadata: {
                microphoneDistance: 'NEARFIELD', //MIDFIELD
                interactionType: 'VOICE_SEARCH',
                audioTopic: 'DEM Test'
              }
            }

        };
    },

    speechToText: function(audio, lang) {
        this.sttRequest.config.languageCode = lang;
        this.sttRequest.audio = {
            content: audio,
        };

        const responses = this.stt.recognize(this.sttRequest);
        const results = responses[0].results[0].alternatives[0];
        return {
            'transcript' : results.transcript,
            'detectLang': lang
        };
    },

    speechStreamToText: function(stream, lang, name, seq_num, cb) { 
      let hasText = false;
      this.sttRequest.config.languageCode = lang;
      const recognizeStream = this.stt.streamingRecognize(this.sttRequest)
      .on('data', function(data){
        console.log(data.results[0].alternatives[0]);
        hasText = true;
        cb(name, seq_num, data.results[0].alternatives[0]);
      })
      .on('error', (e) => {
        console.log(e);
      })
      .on('end', () => {
        console.log('on end');
        if (!hasText){
          cb(name, seq_num, null);
        }        
      });

      stream.pipe(recognizeStream);

      stream.on('end', function() {
        console.log('In end');
          //fileWriter.end();
      });
    }
};
