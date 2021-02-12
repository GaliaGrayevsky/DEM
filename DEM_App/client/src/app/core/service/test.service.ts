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
import { Test, SubTest } from "../domain/tests.model";
import { ApiEndpointService } from "./api-endpoint.service";

@Injectable({
    providedIn: "root"
})
export class TestService {
    /**
     * Constructor.
     */
    constructor(private http: HttpClient) {
    }

    /**
     * Requests a list of Patients from the API.
     */
    public getAll(patient_id: number): Observable<Test[]> {
        const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_TESTS);
        console.info(`getAll( Getting all tests of the patient from API "${url}". )`);

        const params = {
            patient_id: patient_id,           
        };

        return this.http.post(url, params).pipe(
            map((response: Test[]) => {
                console.info(`getAllSuccess( Received all ${(response || []).length} tests. )`);
                return response;
            }),
            catchError((fault: HttpErrorResponse) => {
                console.warn(`getAllFault( ${fault.message} )`);
                return throwError(fault);
            })
        );
    }

    /**
     * Create new test for patient
     */
    public createTest(patient_id: number): Observable<boolean> {
        const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.CREATE_TEST);
 
        const params = {
            patient_id: patient_id
        };

        return this.http.post(url, params).pipe(
            map((response: boolean) => {
                return response;
            }),
            catchError((fault: HttpErrorResponse) => {
                console.warn(`createFault( ${fault.message} )`);
                return throwError(fault);
            })
        );
    }

    /**
     * Update given patient details 
     */
    public update(patient: Test): Observable<boolean> {
        const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.UPDATE_TEST);
 
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
