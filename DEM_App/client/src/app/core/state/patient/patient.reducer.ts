import {
    createEntityAdapter,
    EntityAdapter,
    EntityState
} from "@ngrx/entity";
import { Patient } from "../../domain/patient.model";
import {
    PatientActions,
    PatientActionTypes
} from "./patient.action";

/**
 * Interface to the part of the Store containing PatientState
 * and other information related to PatientData.
 */
export interface PatientState extends EntityState<Patient> {
    selectedPatientId: number | null;
}

/**
 * createEntityAdapter creates an object of many helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Patient> = createEntityAdapter<Patient>(
    {
        selectId: patient => patient.patient_id
    }
);

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: PatientState = adapter.getInitialState({
    // additional entity state properties
    selectedPatientId: null
});

export function patientReducer(state = initialState, action: PatientActions): PatientState {
    switch (action.type) {
        case PatientActionTypes.NavigateToEditPatient:
        case PatientActionTypes.Select: {
            return Object.assign({}, state, { selectedPatientId: action.payload });
        }

        case PatientActionTypes.GetPatientsSuccess: {
            return adapter.addAll(action.payload, state);
        }

        case PatientActionTypes.Add: {
            return adapter.addOne(action.payload, state);
        }

        case PatientActionTypes.Update: {
            return adapter.upsertOne(action.payload, state);
        }

        case PatientActionTypes.Delete: {
            return adapter.removeOne(action.payload.patient_id, state);
        }

        default:
            return state;
    }
}

export const getSelectedPatientId = (state: PatientState) => state.selectedPatientId;

// Entity selectors
const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();

// select the array of Patient ids
export const selectPatientIds = selectIds;

// select the dictionary of Patient entities
export const selectPatientEntities = selectEntities;

// select the array of Patients
export const selectAllPatient = selectAll;

// select the total Patient count
export const selectPatientTotal = selectTotal;
