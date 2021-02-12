import { Action } from "@ngrx/store";
import { Test, SubTest } from "../../domain/tests.model";

export enum TestActionTypes {
    GetTests = "[Test] GetTests",
    GetTestsSuccess = "[Test] GetTestSuccess",
    GetTestsFault = "[Test] GetTestFault",

    CreateTest = "[Test] CreateTest",
    CreateTestSuccess = "[Test] CreateTestSuccess",
    CreateTestsFault = "[Test] CreateTestFault",

    NavigateToSubTests = "[Test] NavigateToSubTests",

    Select = "[Test] Select",
    Add = "[Test] Add",
    Update = "[Test] Update",
    UpdateTotal = "[Test] UpdateTotal",
    Delete = "[Test] Delete",
}

export class GetTests implements Action {
    readonly type = TestActionTypes.GetTests;

    constructor(public payload: number) {
    }
}

export class GetTestsSuccess implements Action {
    readonly type = TestActionTypes.GetTestsSuccess;

    constructor(public payload: Test[]) {
    }
}

export class GetTestsFault implements Action {
    readonly type = TestActionTypes.GetTestsFault;

    constructor(public errorMessage: string) {
    }
}

export class CreateTest implements Action {
    readonly type = TestActionTypes.CreateTest;

    constructor(public payload: number) {
    }
}

export class CreateTestSuccess implements Action {
    readonly type = TestActionTypes.CreateTestSuccess;

}

export class CreateTestFault implements Action {
    readonly type = TestActionTypes.CreateTestsFault;

    constructor(public errorMessage: string) {
    }
}

export class NavigateToSubTests implements Action {
    readonly type = TestActionTypes.NavigateToSubTests;

    constructor(public payload: Test) {
    }
}

export class Select implements Action {
    readonly type = TestActionTypes.Select;

    constructor(public payload: number) {
    }
}

export class Add implements Action {
    readonly type = TestActionTypes.Add;

    constructor(public payload: Test) {
    }
}

export class Update implements Action {
    readonly type = TestActionTypes.Update;

    constructor(public payload: Test) {
    }
}

export class UpdateTotal implements Action {
    readonly type = TestActionTypes.UpdateTotal;

    constructor(public payload: Test) {
    }
}

export class Delete implements Action {
    readonly type = TestActionTypes.Delete;

    constructor(public payload: Test) {
    }
}

export type TestActions =
    | GetTests
    | GetTestsSuccess
    | GetTestsFault
    | NavigateToSubTests
    | Select
    | Add
    | Update
    | UpdateTotal
    | Delete
    ;
