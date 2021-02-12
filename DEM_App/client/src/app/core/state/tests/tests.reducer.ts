import {
    createEntityAdapter,
    EntityAdapter,
    EntityState
} from "@ngrx/entity";
import { Test } from "../../domain/tests.model";
import {
    TestActions,
    TestActionTypes
} from "./tests.action";

/**
 * Interface to the part of the Store containing TestState
 * and other information related to TestData.
 */
export interface TestState extends EntityState<Test> {
    selectedTestId: number | null;
}

/**
 * createEntityAdapter creates an object of many helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Test> = createEntityAdapter<Test>(
    {
        selectId: test => test.test_id
    }
);

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: TestState = adapter.getInitialState({
    // additional entity state properties
    selectedTestId: null
});

export function testReducer(state = initialState, action: TestActions): TestState {
    switch (action.type) {
        
        case TestActionTypes.Select: {
            return Object.assign({}, state, { selectedTestId: action.payload });
        }

        case TestActionTypes.GetTestsSuccess: {
            return adapter.addAll(action.payload, state);
        }

        case TestActionTypes.Add: {
            return adapter.addOne(action.payload, state);
        }

        case TestActionTypes.Update: {
            return adapter.upsertOne(action.payload, state);
        }

        case TestActionTypes.Delete: {
            return adapter.removeOne(action.payload.test_id, state);
        }

        default:
            return state;
    }
}

export const getSelectedTestId = (state: TestState) => state.selectedTestId;

// Entity selectors
const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();

// select the array of Test ids
export const selectTestIds = selectIds;

// select the dictionary of Test entities
export const selectTestEntities = selectEntities;

// select the array of Tests
export const selectAllTests = selectAll;

// select the total Test count
export const selectTestTotal = selectTotal;
