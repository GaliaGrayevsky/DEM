import {
    Component,
    OnInit
} from "@angular/core";
import {
    select,
    Store
} from "@ngrx/store";
import { Observable } from "rxjs";
import { Patient, defaultPatient } from "../../../core/domain/patient.model";
import * as fromState from "../../../core/state";
import * as PatientActions from "../../../core/state/patient/patient.action";

@Component({
    selector: "app-patient-form-container",
    template: `
        <app-patient-form
                [patientInput] = "patientInput"
				[error]="error$ | async"
				[pending]="pending$ | async"
				(patient)="onUpdate($event)"
		>
		</app-patient-form>
    `
})
export class PatientFormContainer implements OnInit {
    /**
     * The possible login error.
     */
    public error$: Observable<string>;

    /**
     * Flag indicating if login is pending.
     */
    public pending$: Observable<boolean>;

    /**
     * Holds current selected patient
     */
    public patientInput: Patient;

    /**
     * Constructor.
     */
    public constructor(private store$: Store<any>) {
    }

    /**
     * Initialize the component.
     */
    public ngOnInit() {
        this.error$ = this.store$.pipe(select(fromState.getError));
        this.pending$ = this.store$.pipe(select(fromState.getPending));  
        this.store$.pipe(select(fromState.selectCurrentPatient)).subscribe(
            (patient) => {
                if (patient) {
                    this.patientInput = patient;
                } else {
                    this.patientInput = defaultPatient;
                }
                
            }
        );      
    }

    /**
     * Attempt to update the patient.
     */
    public onUpdate(event: Patient) {
        this.store$.dispatch(new PatientActions.Update(event));
    }

}
