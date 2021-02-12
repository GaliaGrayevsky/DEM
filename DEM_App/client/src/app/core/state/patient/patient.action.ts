import { Action } from "@ngrx/store";
import { Patient } from "../../domain/patient.model";

export enum PatientActionTypes {
    GetPatients = "[Patient] GetPatient",
    GetPatientsSuccess = "[Patient] GetPatientSuccess",
    GetPatientsFault = "[Patient] GetPatientFault",

    NavigateToEditPatient = "[Patient] NavigateToEditPatient",
    NavigateToOpenCard = "[Patient] NavigateToOpenCard",

    Select = "[Patient] Select",
    Add = "[Patient] Add",
    Update = "[Patient] Update",
    Delete = "[Patient] Delete",
}

export class GetPatients implements Action {
    readonly type = PatientActionTypes.GetPatients;

    constructor(public payload: string) {
    }
}

export class GetPatientsSuccess implements Action {
    readonly type = PatientActionTypes.GetPatientsSuccess;

    constructor(public payload: Patient[]) {
    }
}

export class GetPatientsFault implements Action {
    readonly type = PatientActionTypes.GetPatientsFault;

    constructor(public errorMessage: string) {
    }
}

export class NavigateToEditPatient implements Action {
    readonly type = PatientActionTypes.NavigateToEditPatient;

    constructor(public payload: Patient) {
    }
}

export class NavigateToOpenCard implements Action {
    readonly type = PatientActionTypes.NavigateToOpenCard;

    constructor(public payload: Patient) {
    }
}

export class Select implements Action {
    readonly type = PatientActionTypes.Select;

    constructor(public payload: number) {
    }
}

export class Add implements Action {
    readonly type = PatientActionTypes.Add;

    constructor(public payload: Patient) {
    }
}

export class Update implements Action {
    readonly type = PatientActionTypes.Update;

    constructor(public payload: Patient) {
    }
}

export class Delete implements Action {
    readonly type = PatientActionTypes.Delete;

    constructor(public payload: Patient) {
    }
}

export type PatientActions =
    | GetPatients
    | GetPatientsSuccess
    | GetPatientsFault
    | NavigateToEditPatient
    | NavigateToOpenCard
    | Select
    | Add
    | Update
    | Delete
    ;
