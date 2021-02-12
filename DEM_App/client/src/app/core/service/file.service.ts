import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse
} from "@angular/common/http";

import {
  Observable,
  throwError,
  of
} from "rxjs";
import {
  catchError,
  map
} from "rxjs/operators";

import { ApiEndpointService } from "./api-endpoint.service";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  /**
   * Upload audio file and get transcription
   */
  public uploadAudio(file: string, languageCode: string, file_name: string): Observable<string> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.UPLOAD_AUDIO);

    const params = {
        file_context: file,
        languageCode: languageCode,
        file_name: file_name
    };

    return this.http.post(url, params).pipe(
        map((response: string) => {
            return response;
        }),
        catchError((fault: HttpErrorResponse) => {
            console.warn(`createFault( ${fault.message} )`);
            return throwError(fault);
        })
    );
  }

  /**
   * Combine audio file and get transcription
   */
  public combineAudio(languageCode: string, file_name: string): Observable<string> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.COMBINE_AUDIO);

    const params = {
        languageCode: languageCode,
        file_name: file_name
    };

    return this.http.post(url, params).pipe(
        map((response: string) => {
            return response;
        }),
        catchError((fault: HttpErrorResponse) => {
            console.warn(`createFault( ${fault.message} )`);
            return throwError(fault);
        })
    );
  }
}
