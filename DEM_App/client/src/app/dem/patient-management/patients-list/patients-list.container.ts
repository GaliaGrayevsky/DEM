import {
    Component,
    OnInit
} from "@angular/core";
import {
    select,
    Store
} from "@ngrx/store";
import { Observable } from "rxjs";
import { Patient } from "../../../core/domain/patient.model";
import * as fromState from "../../../core/state";
import * as PatientAction from "../../../core/state/patient/patient.action";

@Component({
    selector: "app-patient-list-container",
    template: `
	    <app-patients-list
            [patients]="patients$ | async" (action) = dispatchAction($event) (openCard) = dispatchOpenCard($event)
	    >
	    </app-patients-list>
    `
})
export class PatientsListContainer implements OnInit {
    /**
     * The username for the currently logged in user.
     */
    public patients$: Observable<Patient[]>;
    public username: string;
    /**
     * Constructor.
     */
    public constructor(private store$: Store<any>) {
    }

    /**
     * Initialize the component.
     */
    public ngOnInit() {
        this.patients$ = this.store$.pipe(select(fromState.selectAllPatient));
        this.store$.pipe(select(fromState.getUserName)).subscribe(
            (data) => {
                this.username = data;
                this.store$.dispatch(new PatientAction.GetPatients(data));
            } 
        );        
    }

    public dispatchAction(event: Patient){
        event.doctor_id = this.username;
        this.store$.dispatch(new PatientAction.NavigateToEditPatient(event));
    }

    public dispatchOpenCard(event: Patient){
        this.store$.dispatch(new PatientAction.NavigateToOpenCard(event));
    }
}
