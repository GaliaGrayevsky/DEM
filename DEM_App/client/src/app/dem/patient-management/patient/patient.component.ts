import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter
} from "@angular/core";
import { Test, defaultTest } from "../../../core/domain/tests.model";

import { trackByFn } from "../../../util/angular.util";

@Component({
  selector: 'app-patient-component',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

  /**
   * List of tests to display.
   */
  @Input() public tests: Test[];
  @Input() public currentPatient: number;

  /**
   * Used to track items in the ngFor for better performance.
   */
  public trackTest: Function = trackByFn;


  @Output() action: EventEmitter<Test> = new EventEmitter<Test>();
  @Output() openCard: EventEmitter<Test> = new EventEmitter<Test>();

  defaultTestForCreate: Test = defaultTest;
  /**
   * Initialize the component.
   */
  public ngOnInit() {
  }

  public ngOnChanges(){
    console.log(this.tests);
    console.log(this.currentPatient);
  }

  fireAction(event:Test): void{
      this.action.emit(event);
  }

  fireOpenTest(event:Test): void{
      this.openCard.emit(event);
  }
}

