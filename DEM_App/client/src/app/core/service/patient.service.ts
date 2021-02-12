import {
    HttpClient,
    HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    Observable,
    throwError,
    of
} from "rxjs";
import {
    catchError,
    map
} from "rxjs/operators";
import { Patient } from "../domain/patient.model";
import { ApiEndpointService } from "./api-endpoint.service";

@Injectable({
    providedIn: "root"
})
export class PatientService {
    /**
     * Constructor.
     */
    constructor(private http: HttpClient) {
    }

    /**
     * Requests a list of Patients from the API.
     */
    public getAll(username: string): Observable<Patient[]> {
        const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_PATIENTS);
        console.info(`getAll( Getting all patients from API "${url}". )`);

        const params = {
            username: username,           
        };

        return this.http.post(url, params).pipe(
            map((response: Patient[]) => {
                console.info(`getAllSuccess( Received all ${(response || []).length} patients. )`);
                return response;
            }),
            catchError((fault: HttpErrorResponse) => {
                console.warn(`getAllFault( ${fault.message} )`);
                return throwError(fault);
            })
        );
    }

    /**
     * Update given patient details 
     */
    public update(patient: Patient): Observable<boolean> {
        const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.UPDATE_PATIENT);
 
        const params = patient;

        return this.http.post(url, params).pipe(
            map((response: boolean) => {
                return response;
            }),
            catchError((fault: HttpErrorResponse) => {
                console.warn(`getAllFault( ${fault.message} )`);
                return throwError(fault);
            })
        );
    }
}
