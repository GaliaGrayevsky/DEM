import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    FormControl
} from "@angular/forms";
import { Patient, defaultPatient } from "../../../core/domain/patient.model";
import * as FormUtil from "../../../util/form.util";
import { LANGS, SEX, LANG_TYPE } from '../../../core/domain/constants';

@Component({
    selector: "app-patient-form",
    templateUrl: "./patient-form.component.html",
    styleUrls: [ "./patient-form.component.scss" ]
})
export class PatientFormComponent implements OnInit {
    
    langs: LANG_TYPE[] = LANGS;
    sexEnum = SEX;
    
    /**
     * An optional error message to display if login failed.
     */
    @Input()
    public error = "";

    /**
     * Flag indicating if login is pending.
     */
    @Input()
    public pending = false;

    /** Hold patient to edit */
    @Input() patientInput: Patient;

    /**
     * Dispatches an event to perform login.
     */
    @Output()
    public patient: EventEmitter<Patient> = new EventEmitter<Patient>();

    title: string = 'Create new ';
    action: string = 'Create';
    /**
     * Reference to the login form.
     */
    public patientForm: FormGroup;

    /**
     * Constructor
     */
    constructor(private formBuilder: FormBuilder) {
    }

    /**
     * Initializes the component by building the form.
     *
     * TODO: BMR: 01/10/2019: Add form validation in a future post.
     */
    public ngOnInit(): void {

        if (this.patientInput && this.patientInput.patient_id){
            this.title = "Update existing ";
            this.action = "Update"
        }

        this.patientForm = new FormGroup(
            this.formBuilder.group({
                lang_code: [],
                age: [],
                sex: []
            }).controls,
            {
                updateOn: "blur"
            }
        );

        this.setFormValue();
    }

    /**
     * Accessor for the form's value, aka the data container object representing the
     * form field's current values.
     */
    public getFormValue(): Patient {
        return {
            patient_id: this.patientInput && this.patientInput.patient_id ? this.patientInput.patient_id : null,
            doctor_id: this.patientInput && this.patientInput.doctor_id ? this.patientInput.doctor_id : null,
            lang_code: FormUtil.getFormFieldValue(this.patientForm, "lang_code"),
            age: FormUtil.getFormFieldValue(this.patientForm, "age"),
            sex: FormUtil.getFormFieldValue(this.patientForm, "sex")
        };
    }

    /**
     * Setting form's value, setting value of data container object representing the
     * form field's current values.
     */
    public setFormValue(): void {
        FormUtil.setFormFieldValue(this.patientForm, 'lang_code', this.patientInput && this.patientInput.lang_code ? this.patientInput.lang_code : this.langs[0]);
        FormUtil.setFormFieldValue(this.patientForm, 'age', this.patientInput && this.patientInput.age ? this.patientInput.age : 6);
        FormUtil.setFormFieldValue(this.patientForm, 'sex', this.patientInput && this.patientInput.sex ? this.patientInput.sex : SEX.MALE);
    }

    /**
     * Handles the form submission and emits a login event with the user's credentials.
     * @param event
     */
    public onUpdate(event: any) {
        const payload: Patient = this.getFormValue();
        this.patient.emit(payload);
    }
}
