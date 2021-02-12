import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class ApiEndpointService {
    /**
     * Map of protocols for API endpoints.
     */
    public static PROTOCOL = {
        HTTP: "http://",
        HTTPS: "https://"
    };

    /**
     * Map of domains for API endpoints.
     */
    public static DOMAIN = {
        LOCAL_DEV: "localhost:4301/"
    };

    /**
     * Map of contexts for API endpoints.
     */
    public static CONTEXT = "api/";

    /**
     * Map of contexts for API endpoints.
     */
    public static AUTH_CONTEXT = "auth/";
    public static PATIENTS_CONTEXT = "patients/";
    public static TESTS_CONTEXT = "tests/";
    public static AUDIO_CONTEXT = "audio/";

    /**
     * Map of API endpoints.
     */
    public static ENDPOINT = {
        LOGIN: `${ApiEndpointService.AUTH_CONTEXT}login/`,
        REGISTER: `${ApiEndpointService.AUTH_CONTEXT}register/`,
        GET_PATIENTS: `${ApiEndpointService.PATIENTS_CONTEXT}getpatients/`,
        UPDATE_PATIENT: `${ApiEndpointService.PATIENTS_CONTEXT}updatepatient/`,
        GET_TESTS: `${ApiEndpointService.TESTS_CONTEXT}getTests/`,
        CREATE_TEST: `${ApiEndpointService.TESTS_CONTEXT}createTest/`,
        UPDATE_TEST: `${ApiEndpointService.TESTS_CONTEXT}updateTest/`,
        UPLOAD_AUDIO: `${ApiEndpointService.AUDIO_CONTEXT}uploadAndTranscribeAudio/`,
        COMBINE_AUDIO: `${ApiEndpointService.AUDIO_CONTEXT}combineAndTranscribeRecordedAudio/`,
        GET_SUBTESTS: `${ApiEndpointService.TESTS_CONTEXT}getSubTests/`,
        CREATE_SUBTEST: `${ApiEndpointService.TESTS_CONTEXT}createSubTest/`,
        UPDATE_SUBTESTS: `${ApiEndpointService.TESTS_CONTEXT}updateSubTests/`
    };

    /**
     * Constructor.
     */
    constructor(private http: HttpClient) {
    }

    /**
     * Constructs an API endpoint.
     *
     * NOTE: In the future this could construct API endpoints using environmental configs provided
     * at build time or at runtime via (for example) query string params...but for now we'll
     * keep this dumb simple.
     */
    public static getEndpoint(endpoint: string): string {
        const protocol: string = ApiEndpointService.PROTOCOL.HTTP;
        const domain: string = ApiEndpointService.DOMAIN.LOCAL_DEV;
        const context: string = ApiEndpointService.CONTEXT;
        return `${protocol}${domain}${context}${endpoint}`;
    }

    /**
     * Determines if the requested URL is an authentication API endpoint.
     * @param {string} url
     * @returns {boolean}
     */
    public static isAuthEndpoint(url: string = ""): boolean {
        return url.toLowerCase().indexOf(ApiEndpointService.AUTH_CONTEXT) > -1;
    }

    /**
     * Determines if the requested URL is an API endpoint.
     * @param {string} url
     * @returns {boolean}
     */
    public static isApiEndpoint(url: string = ""): boolean {
        return url.toLowerCase().indexOf(ApiEndpointService.CONTEXT) > -1;
    }
}
