import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter
} from "@angular/core";
import { SubTest, defaultSubTest, subTestType, subTests } from "../../../core/domain/tests.model";

import { trackByFn } from "../../../util/angular.util";

export type recType = {
  start_time: number,
  selectedTest: number
}

export type fileType = {
  file: string,
  subTest: number
}

@Component({
  selector: 'app-test-component',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  /**
   * List of tests to display.
   */
  @Input() public subTests$: SubTest[];
  @Input() public currentLangCode:string;
  @Input() public currentText: string;
  @Input() public triggerChange: number;
  @Input() public totalScore: number;
  @Input() public overall_comment: string;

  /**
   * Used to track items in the ngFor for better performance.
   */
  public trackTest: Function = trackByFn;

  public subTestsList: subTestType[] = subTests;
  private selectedSubTest: number = 0;

  /** Indicators of the current activity */
  public isRecording: boolean = false; // for audio uploading
  public isRecognizing: boolean = false; // for speech recognition

  public upload_form_open: boolean = false;

  private testImgMap = {
    0: {
          img_name: 'testa',
          icon_name: 'swap_vert',
          test_name: 'A'
        },
    1: {
          img_name: 'testb',
          icon_name: 'swap_vert',
          test_name: 'B'
        },
    2: {
          img_name: 'horizontal',
          icon_name: 'swap_horiz',
          test_name: 'C'
        }
  }

  @Output() recognize: EventEmitter<recType> = new EventEmitter<recType>();
  @Output() file_context: EventEmitter<fileType> = new EventEmitter<fileType>();
  @Output() calculate_total: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Initialize the component.
   */
  public ngOnInit() {
  }

  fireRecognition(event): void {
    console.log('!!! Firing recognition! s');
    this.isRecognizing = !this.isRecognizing;
    this.recognize.emit({
      start_time: event.start_time,
      selectedTest: this.selectedSubTest
    });
  }

  print(e) {
    console.log(e);
  }

  fireOpenTest(event:SubTest): void{
      //this.openCard.emit(event);
  }

  setSelected(event) {
    this.selectedSubTest = event;
  }

  openUploadForm(){
    this.upload_form_open = true;
  }

  closeUploadForm(file: string){
    this.upload_form_open = false;
    this.file_context.emit({
      file: file,
      subTest: this.selectedSubTest
    });
  }

  calculateScore() {
    this.calculate_total.emit(this.overall_comment);
  }
}

