import { Component } from "@angular/core";
import { select, Store } from "@ngrx/store";
import * as fromState from "./core/state";
import * as AuthActions from "./core/state/auth/auth.action";

@Component({
    selector: "blog-app",
    templateUrl: "./app.component.html",
    styleUrls: [ "./app.component.scss" ]
})
export class AppComponent {

    title = "DEM Automation";
    userName:string;
    isLoggedIn:boolean;

  constructor(private store$: Store<any>) { }

  ngOnInit() {
    this.store$.pipe(select(fromState.getUserName)).subscribe(
        data => { 
            this.userName = data;
        }
    );

    this.store$.pipe(select(fromState.getIsLoggedIn)).subscribe(
        data => { 
            this.isLoggedIn = data;
        }
    );
  }

  navigateToAction(event: string) {
    if (event == 'Login') {
        this.store$.dispatch(new AuthActions.NavigateToLogin());
    }

    if (event == 'Register') {
        this.store$.dispatch(new AuthActions.NavigateToRegister());
    }
  }
}
