import {
    ChangeDetectionStrategy,
    Component,
    Input,
    Output,
    OnInit,
    EventEmitter
} from "@angular/core";
import { Patient, defaultPatient } from "../../../core/domain/patient.model";

import { trackByFn } from "../../../util/angular.util";
import { getLanguageLongName } from '../../../core/domain/constants';

@Component({
    selector: "app-patients-list",
    templateUrl: "./patients-list.component.html",
    styleUrls: ['./patients-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientsListComponent implements OnInit {

    /**
     * List of patients to display.
     */
    @Input()
    public patients: Patient[];

    /**
     * Used to track items in the ngFor for better performance.
     */
    public trackPatient: Function = trackByFn;

    public getLanguageLongNamePatient: Function = getLanguageLongName;

    @Output() action: EventEmitter<Patient> = new EventEmitter<Patient>();
    @Output() openCard: EventEmitter<Patient> = new EventEmitter<Patient>();

    defaultPatientForCreate: Patient = defaultPatient;
    /**
     * Initialize the component.
     */
    public ngOnInit() {
    }

    fireAction(event:Patient): void{
        this.action.emit(event);
    }

    fireOpenPatientCard(event:Patient): void{
        this.openCard.emit(event);
    }
}
