import {
  Component,
  OnInit
} from "@angular/core";
import {
  select,
  Store
} from "@ngrx/store";
import { Observable } from "rxjs";
import { Test } from "../../../core/domain/tests.model";
import * as fromState from "../../../core/state";
import * as TestAction from "../../../core/state/tests/tests.action";

@Component({
  selector: "app-patient",
  template: `
    <app-patient-component
          [tests]="tests$" [currentPatient] = "currentPatientId" (action) = dispatchAction($event) (openCard) = dispatchOpenCard($event)>
    </app-patient-component>
  `
})
export class PatientContainer implements OnInit {
  /**
   * The username for the currently logged in user.
   */
  public tests$: Test[];

  currentPatientId: number;
  /**
   * Constructor.
   */
  public constructor(private store$: Store<any>) {
  }

  /**
   * Initialize the component.
   */
  public ngOnInit() {
      this.store$.pipe(select(fromState.selectAllTests)).subscribe((data) => {
        this.tests$ = data;
      });
      this.store$.pipe(select(fromState.selectCurrentPatient)).subscribe(
        (patient) => {
            if (patient) {
              this.currentPatientId = patient.patient_id;
              this.store$.dispatch(new TestAction.GetTests(patient.patient_id));
            }             
        }
    );        
  }

  public dispatchAction(event: Test){
    this.store$.dispatch(new TestAction.CreateTest(this.currentPatientId));
  }

  public dispatchOpenCard(event: Test){
      this.store$.dispatch(new TestAction.NavigateToSubTests(event));
  }
}

