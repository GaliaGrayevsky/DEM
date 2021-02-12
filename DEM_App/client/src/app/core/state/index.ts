import {
    ActionReducerMap,
    createFeatureSelector,
    createSelector
} from "@ngrx/store";
import { defaultPatient } from "../domain/patient.model";
import { defaultTest } from "../domain/tests.model";
import * as fromAuth from "./auth/auth.reducer";
import * as fromPatient from "./patient/patient.reducer";
import * as fromTest from "./tests/tests.reducer";

export interface AppState {
    auth: fromAuth.AuthState;
    patient: fromPatient.PatientState;
    test: fromTest.TestState;
}

export const reducers: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer,
    patient: fromPatient.patientReducer,
    test: fromTest.testReducer
};

// -------------------------------------------------------------------
// AUTH SELECTORS
// -------------------------------------------------------------------
export const selectAuthState = createFeatureSelector<fromAuth.AuthState>("auth");

export const getUserName = createSelector(
    selectAuthState,
    fromAuth.getUserName
);

export const getToken = createSelector(
    selectAuthState,
    fromAuth.getToken
);

export const getIsLoggedIn = createSelector(
    selectAuthState,
    fromAuth.getIsLoggedIn
);

export const getError = createSelector(
    selectAuthState,
    fromAuth.getError
);

export const getPending = createSelector(
    selectAuthState,
    fromAuth.getPending
);

// -------------------------------------------------------------------
// Patient SELECTORS
// -------------------------------------------------------------------
export const selectPatientState = createFeatureSelector<fromPatient.PatientState>("patient");

export const selectPatientIds = createSelector(
    selectPatientState,
    fromPatient.selectPatientIds
);
export const selectPatientEntities = createSelector(
    selectPatientState,
    fromPatient.selectPatientEntities
);
export const selectAllPatient = createSelector(
    selectPatientState,
    fromPatient.selectAllPatient
);
export const selectCurrentPatientId = createSelector(
    selectPatientState,
    fromPatient.getSelectedPatientId
);

export const selectCurrentPatient = createSelector(
    selectPatientEntities,
    selectCurrentPatientId,
    (patientEntities, patientId) => {
        return patientId ? patientEntities[ patientId ] : defaultPatient;
    }
);

// -------------------------------------------------------------------
// Test SELECTORS
// -------------------------------------------------------------------
export const selectTestState = createFeatureSelector<fromTest.TestState>("test");

export const selectTestIds = createSelector(
    selectTestState,
    fromTest.selectTestIds
);
export const selectTestsEntities = createSelector(
    selectTestState,
    fromTest.selectTestEntities
);
export const selectAllTests = createSelector(
    selectTestState,
    fromTest.selectAllTests
);
export const selectCurrentTestId = createSelector(
    selectTestState,
    fromTest.getSelectedTestId
);

export const selectCurrentTest = createSelector(
    selectTestsEntities,
    selectCurrentTestId,
    (testEntities, testId) => {
        return testId ? testEntities[ testId ] : defaultTest;
    }
);

