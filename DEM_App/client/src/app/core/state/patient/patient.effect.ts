import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    Actions,
    Effect,
    ofType
} from "@ngrx/effects";
import {
    Action,
    Store
} from "@ngrx/store";
import {
    Observable,
    of
} from "rxjs";
import {
    catchError,
    exhaustMap,
    map,
    mergeMap
} from "rxjs/operators";
import { Patient } from "../../domain/patient.model";
import { PatientService } from "../../service/patient.service";
import * as PatientActions from "./patient.action";
import {
    PatientActionTypes    
} from "./patient.action";
import { appRoutePaths } from "../../../app.routes";
import * as RouterActions from "../router/router.action";

@Injectable()
export class PatientEffect {
    /**
     * Load up some yummy brews.
     */
    @Effect()
    getPatients$: Observable<Action> = this.actions$.pipe(
        ofType<PatientActions.GetPatients>(PatientActionTypes.GetPatients),
        exhaustMap((action) => 
            this.patientService.getAll(action.payload).pipe(
                map((data: Patient[]) => new PatientActions.GetPatientsSuccess(data)),
                catchError((err: HttpErrorResponse) => of(new PatientActions.GetPatientsFault(err.message)))
            )
        )
    );

    /**
     * Navigate to edit patient page
    */
    @Effect()
    navigateToEditPatient$: Observable<Action> = this.actions$.pipe(
        ofType<PatientActions.NavigateToEditPatient>(PatientActionTypes.NavigateToEditPatient),
        mergeMap((action) => {
            return [
                new PatientActions.Select(action.payload.patient_id),
                new RouterActions.Go({ path: appRoutePaths.editPatient})
            ];
        })
    );

    /**
     * Navigate to edit patient page
    */
   @Effect()
   navigateToOpenCard$: Observable<Action> = this.actions$.pipe(
       ofType<PatientActions.NavigateToOpenCard>(PatientActionTypes.NavigateToOpenCard),
       mergeMap((action) => {
           return [
               new PatientActions.Select(action.payload.patient_id),
               new RouterActions.Go({ path: appRoutePaths.patientTests})
           ];
       })
   );

    /**
     * Update the patient data
    */
   @Effect()
   Update$: Observable<Action> = this.actions$.pipe(
       ofType<PatientActions.Update>(PatientActionTypes.Update),
       exhaustMap((action) => 
            this.patientService.update(action.payload).pipe(
                map((data: boolean) => new RouterActions.Go({ path: appRoutePaths.patients})),
                catchError((err: HttpErrorResponse) => of(new PatientActions.GetPatientsFault(err.message)))
            )
        )
   );

    /**
     * Constructor
     */
    constructor(private actions$: Actions, private store$: Store<any>, private patientService: PatientService) {
    }
}
