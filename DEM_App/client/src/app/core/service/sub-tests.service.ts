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
import { SubTest } from "../domain/tests.model";
import { ApiEndpointService } from "./api-endpoint.service";

@Injectable({
  providedIn: 'root'
})
export class SubTestsService {

  /**
   * Constructor.
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Requests a list of Patients from the API.
   */
  public getSubTests(test_id: number): Observable<SubTest[]> {
      const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_SUBTESTS);
      console.info(`getSubTestsAll( Getting all subtests of the test from API "${url}". )`);

      const params = {
          test_id: test_id,           
      };

      return this.http.post(url, params).pipe(
          map((response: any[]) => {

              let subTests: SubTest[] = response.map(e => {
                    let arr = [];
                    let i = 0;
                    let t = e.mistakes_list.split(',');
                    console.log(t);

                    while ( i < t.length - 3) {
                        
                        if (t[i] == 'transpose' || t[i] == 'replace') {
                            arr.push([t[i],t[i+1],t[i+2],t[i+3],t[i+4]]);
                            i += 5;
                        } else {
                            arr.push([t[i],t[i+1],t[i+2],t[i+3]]);
                            i += 4;
                        }
                        
                    }

                    console.log(arr);
                    e.mistakes_list = arr;
                    console.log(e);
                    return e;
              });
              console.info(`getSubTestsAllSuccess( Received all ${(response || []).length} subtests. )`);
              return subTests;
          }),
          catchError((fault: HttpErrorResponse) => {
              console.warn(`getAlgetSubTestsAllFault( ${fault.message} )`);
              return throwError(fault);
          })
      );
  }

   /**
     * Create new subtest for patient
     */
    public createSubTest(test_id: number, sub_test_type_id: number): Observable<boolean> {
      const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.CREATE_TEST);

      const params = {
          test_id: test_id,
          sub_test_type_id: sub_test_type_id
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
   * Create new test for patient
   */
  public updateSubTests(subTests: SubTest[]): Observable<boolean> {
      const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.UPDATE_SUBTESTS);

      const params = {
          subTests: subTests
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
  
}
