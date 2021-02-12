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
import { Test } from "../../domain/tests.model";
import { TestService } from "../../service/test.service";
import * as TestActions from "./tests.action";
import {
    TestActionTypes    
} from "./tests.action";
import { appRoutePaths } from "../../../app.routes";
import * as RouterActions from "../router/router.action";

@Injectable()
export class TestEffect {
    /**
     * Load up some yummy brews.
     */
    @Effect()
    getTests$: Observable<Action> = this.actions$.pipe(
        ofType<TestActions.GetTests>(TestActionTypes.GetTests),
        exhaustMap((action) => 
            this.testService.getAll(action.payload).pipe(
                map((data: Test[]) => new TestActions.GetTestsSuccess(data)),
                catchError((err: HttpErrorResponse) => of(new TestActions.GetTestsFault(err.message)))
            )
        )
    );

    @Effect()
    createTest$: Observable<Action> = this.actions$.pipe(
        ofType<TestActions.CreateTest>(TestActionTypes.CreateTest),
        exhaustMap((action) => 
            this.testService.createTest(action.payload).pipe(
                map((data: boolean) => new TestActions.GetTests(action.payload)),
                catchError((err: HttpErrorResponse) => of(new TestActions.CreateTestFault(err.message)))
            )
        )
    );

    /**
     * Navigate to edit patient page
    */
    @Effect()
    navigateToSubTests$: Observable<Action> = this.actions$.pipe(
        ofType<TestActions.NavigateToSubTests>(TestActionTypes.NavigateToSubTests),
        mergeMap((action) => {
            return [
                new TestActions.Select(action.payload.test_id),
                new RouterActions.Go({ path: appRoutePaths.subTests})
            ];
        })
    );

    /**
     * Update the test data
    */
   @Effect()
   Update$: Observable<Action> = this.actions$.pipe(
       ofType<TestActions.Update>(TestActionTypes.Update),
       exhaustMap((action) => 
            this.testService.update(action.payload).pipe(
                map((data: boolean) => new RouterActions.Go({ path: appRoutePaths.patients})),
                catchError((err: HttpErrorResponse) => of(new TestActions.GetTestsFault(err.message)))
            )
        )
   );

   /**
     * Update the test data
    */
   @Effect()
   UpdateTotal$: Observable<Action> = this.actions$.pipe(
       ofType<TestActions.Update>(TestActionTypes.Update),
       exhaustMap((action) => 
            this.testService.update(action.payload).pipe(
                map((data: boolean) => new TestActions.GetTests(action.payload.test_id)),
                catchError((err: HttpErrorResponse) => of(new TestActions.CreateTestFault(err.message)))
            )
        )
   );

    /**
     * Constructor
     */
    constructor(private actions$: Actions, private store$: Store<any>, private testService: TestService) {
    }
}
