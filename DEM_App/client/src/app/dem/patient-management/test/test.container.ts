import {Component, OnInit} from "@angular/core";
import {select,  Store} from "@ngrx/store";
import { Observable } from "rxjs";
import { SubTest, defaultSubTest, subTests, Test } from "../../../core/domain/tests.model";
import * as fromState from "../../../core/state";
import * as TestAction from "../../../core/state/tests/tests.action";
import { fileType, recType } from './test.component';

import * as recordRTC from 'recordrtc';

import { HORIZONTAL_TRANSCRIPT, VERTICAL_A_TRANSCRIPT, VERTICAL_B_TRANSCRIPT, Distance, lev_dem_distance, cleanString } from '../../../util/lev-dem.util';
import { IoService } from 'src/app/core/service/io.service';
import { FileService } from "src/app/core/service/file.service";
import { SubTestsService } from "src/app/core/service/sub-tests.service";
import { TestService } from 'src/app/core/service/test.service';


@Component({
  selector: "app-test-container",
  template: `
    <app-test-component
          [subTests$]="subTests$" 
          [currentLangCode] = "currentLangCode"
          [currentText] = "final_transcript"
          [triggerChange] = "triggerChange"
          [totalScore] = "totalScore"
          [overall_comment] = "overall_comment"
          (recognize) = toggleRecording($event)
          (file_context) = recognizeRecording($event)
          (calculate_total) = calculateTotal($event)>
    </app-test-component>
    <app-loader *ngIf = "isLoading" [message] = "message"></app-loader>
  `
})
export class TestContainer implements OnInit {
  /**
   * The username for the currently logged in user.
   */
  public subTests$: SubTest[];

  public final_transcript: string = '';
  private transcript_array: any = {};
  private current_seq: number = 0;
  public interim_transcript: string = '';
  public triggerChange: number = 0;
  private recognizing: boolean = false;
  private ignore_onend: boolean;

  private start_timestamp: Date;
  private end_timestamp: Date;
  private duration: number;
  private totalScore: number;
  private overall_comment: string;
  private recognition;
  private currentTest: number;
  private currentTranscriptTemplate: string;

  /** Recording data */
  private isRecording:boolean = false;
  public recordAudio: any;

  currentPatientId: number;
  currentTestId: number;
  currentTestObj: Test;
  currentLangCode: string;

  /** Distance function */
  public distanceFnc = lev_dem_distance;
  public cleanString = cleanString;
  public distance: Distance;

  public isLoading: boolean = false;
  public message: string = "";

  /**
   * Constructor.
   */
  public constructor(private store$: Store<any>, 
                     private ioService:IoService,
                     private fileService: FileService,
                     private testService: TestService,
                     private subTestsService: SubTestsService
                    ) {
  }


  /**
   * Initialize the component.
   */
  public ngOnInit() {

    this.store$.pipe(select(fromState.selectCurrentPatient)).subscribe(
      (patient) => {
          if (patient) {
            this.currentPatientId = patient.patient_id;
            this.currentLangCode = patient.lang_code;
          }             
      }
    ); 

    this.store$.pipe(select(fromState.selectCurrentTest)).subscribe(
      (test) => {
        //Selecting current test Id
          if (test) {
            this.currentTestObj = test;
            this.currentTestId = test.test_id;
            this.totalScore = test.score;
            this.overall_comment = test.comments;
            this.subTestsService.getSubTests(this.currentTestId).subscribe(
              (data) => {
                console.log('Got the following subtests:', data);
                if (data && data.length > 0){
                  this.subTests$ = data;        
                  //this.subTests$ = [{...defaultSubTest}, {...defaultSubTest}, {...defaultSubTest}];
                } else {
                  console.log('Filling the default data');
                  let subTest: SubTest = {...defaultSubTest};
                  subTest.test_id = this.currentTestId;
                  this.subTests$ = [{...subTest}, {...subTest}, {...subTest}];
                }
              }
            );
          }             
      }
    );
    
    
    //this.initializeRecognitionSettings();

    this.ioService.receiveStream('transcript', this, function(transcript, scope) {
      console.log(transcript, scope);

      let i:number = 0;
      let ind: number = 1;

      /** Clean the transcript string, apply substitution of know words, replace all the rest non digit chars */
      if (!!transcript.transcript) {
        transcript.transcript = scope.cleanString(transcript.transcript);
      }

      console.log('Received: ', !transcript.transcript && !scope.transcript_array[transcript.seq_num_prev], transcript.transcript);

      /**  Update the transcript array object (holds all the recived up to now chunks) and then try to construct interim transcript */
      if ((!transcript.transcript && !scope.transcript_array[transcript.seq_num_prev]) || transcript.transcript) {

        scope.transcript_array[transcript.seq_num_prev] = transcript.transcript ? transcript.transcript : '';
        console.log('Update transcript array: ', transcript.seq_num_prev, scope.transcript_array[transcript.seq_num_prev]);

        /** special treatment to start */
        if (transcript.seq_num_prev == 0){
          scope.interim_transcript = scope.transcript_array[transcript.seq_num_prev];
          scope.current_seq++;
        }
        console.log('Set current sequesnce: ', scope.current_seq);
        console.log('Current sequesnce arr value: ', scope.transcript_array[scope.current_seq]);
        
        /** Combine current transcript string - take maximum continuous sequence of transcripts and join them together*/
        while ( scope.transcript_array[scope.current_seq]  || (scope.transcript_array[scope.current_seq] == '')) {

          if ( scope.transcript_array[scope.current_seq] != '' ) {
            i = 0;
            while ( i >= 0 && (scope.transcript_array[scope.current_seq].length + 1) >= ind 
                           && ((i == 0) || (i >= (scope.transcript_array[scope.current_seq-1].length - scope.transcript_array[scope.current_seq].length)))) {
              i = scope.transcript_array[scope.current_seq - 1].indexOf(scope.transcript_array[scope.current_seq].substring(0, ind++));
            }
            scope.interim_transcript = scope.interim_transcript + scope.transcript_array[scope.current_seq].substring(ind-2, scope.transcript_array[scope.current_seq].length+1);
          }

          scope.current_seq++;
        }

         
        console.log(scope.currentTranscriptTemplate.substr(0, scope.interim_transcript.length), scope.interim_transcript);
        scope.distance = scope.distanceFnc(scope.currentTranscriptTemplate.substr(0, scope.interim_transcript.length), scope.interim_transcript);
        scope.updateCurrentTest();
      }
      
    });
  }

  
  updateCurrentTest(){

    let me = this;
    let current:SubTest = me.subTests$[me.currentTest];

    current.sub_test_type_id  = me.currentTest;

    if (me.duration) {
      current.time = me.duration * 1000;
      me.duration = null;
    } else {
      current.time = (+(me.end_timestamp ? me.end_timestamp : new Date()) - +me.start_timestamp);
    }
    
    current.audio_text = me.distance.text;
    current.additions = me.distance.additions;
    current.deletions = me.distance.deletions;
    current.substitutions = me.distance.substitutions;
    current.transpositions = me.distance.transpositions;
    current.mistakes_list = me.distance.ops;
    me.triggerChange++;
  }

  //** Using RecordRTC to stream the speech to server and get transcripted string */

  onStart() {
    let me = this;
    me.isRecording = true;
    me.ioService.setDefaultLanguage(me.currentLangCode);

    

    /**
     * Initialize the current subtest recording
    */

    console.log('Setting language to: ', this.currentLangCode);
    me.final_transcript = '';
    this.interim_transcript = '';

    let stream_seq: number = 0;

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(function(stream: MediaStream) {
        me.recordAudio = recordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/webm',
            sampleRate: 44100, 
            recorderType: recordRTC.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            timeSlice: 1000,
            desiredSampRate: 16000,

            async ondataavailable(blob) {              
              
              let file_name =  me.currentTestId + '_' + me.currentTest;
              console.log('File name: ', file_name);

              me.ioService.sendBinaryStream(blob, file_name, (stream_seq++));
              
              if (!me.isRecording) {
                me.stopRecording();
              }

            }
        });
        me.recordAudio.startRecording();

    }).catch(function(error) {
        console.error(JSON.stringify(error));
    });
  }

  onStop() {
    // recording stopped
    this.isRecording = false;
    // stop audio recorder
  }

  stopRecording(){
    this.recordAudio.stopRecording();

    this.transcript_array = {};
    this.current_seq = 0;

    this.final_transcript = this.interim_transcript;

    let me = this;
    let file_name:string = me.currentTestId + '_' + me.currentTest;

    this.isLoading = true;

    /** Combining all chunks into one single file and transcribe it */
    this.fileService.combineAudio( me.currentLangCode, file_name).subscribe(
      transcript => {        
        console.log('Transcript: ', transcript['transcript']);   
        console.log('Duration: ', transcript['duration']);   

        this.subTests$[this.currentTest].audio_text = me.currentTranscriptTemplate;
        me.distance = me.distanceFnc(me.currentTranscriptTemplate, transcript['transcript']);
        me.duration = transcript['duration'];
        me.updateCurrentTest();
        this.isLoading = false;
      }
    );

  }

  public toggleRecording(event: recType){
    if (this.isRecording) {
      this.onStop();
      return;
    } else {

      console.log('Setting language to: ', this.currentLangCode);
      this.final_transcript = '';
      this.onStart();
      this.ignore_onend = false;
      this.start_timestamp = new Date();
      this.currentTest = event.selectedTest;

      console.log('Setting template by : ', this.currentTest);

      switch (this.currentTest) {
        case 0:
          this.currentTranscriptTemplate = VERTICAL_A_TRANSCRIPT;
          break;
        
        case 1:
          this.currentTranscriptTemplate = VERTICAL_B_TRANSCRIPT;
          break;
      
        default:
          this.currentTranscriptTemplate = HORIZONTAL_TRANSCRIPT;
          break;
      }
       
      console.log('Setting template to : ', this.currentTranscriptTemplate);
    }

    

  }

  public recognizeRecording(event: fileType){

    let me = this;

    let file_name:string = me.currentTestId + '_' + event.subTest;
    me.currentTest = event.subTest;

    this.isLoading = true;
    this.message = 'Transcribing, please be patient!'

    switch (event.subTest) {
      case 0:
        me.currentTranscriptTemplate = VERTICAL_A_TRANSCRIPT;
        break;
      
      case 1:
        me.currentTranscriptTemplate = VERTICAL_B_TRANSCRIPT;
        break;
    
      default:
        me.currentTranscriptTemplate = HORIZONTAL_TRANSCRIPT;
        break;
    }

    this.subTests$[this.currentTest].audio = file_name;

    this.fileService.uploadAudio(event.file, me.currentLangCode, file_name).subscribe(
      transcript => {        
        console.log('Transcript: ', transcript['transcript']);   
        console.log('Duration: ', transcript['duration']);   

        this.subTests$[this.currentTest].audio_text = me.currentTranscriptTemplate;
        me.distance = me.distanceFnc(me.currentTranscriptTemplate, transcript['transcript']);
        me.duration = transcript['duration'];
        this.isLoading = false;
        me.updateCurrentTest();
      }
    );
  }

  public calculateTotal(event: string){
    this.isLoading = true;
    this.message = 'Saving tests data, please wait!';

    if (event){
      this.totalScore = this.subTests$[2].time * (80/(80 - this.subTests$[2].deletions + this.subTests$[2].additions));
      /**
       * Update all sub tests data once recognition is finished
       */
      this.subTestsService.updateSubTests(this.subTests$).subscribe(data => {
      
        /**
         * Upadate total of the test
         */
        this.currentTestObj.score = this.totalScore;
        console.log(this.overall_comment);
        this.currentTestObj.comments = event;
        this.testService.update(this.currentTestObj).subscribe(data => this.isLoading = false);

      });
    }
  }
  
}

