import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import {
    RouterModule,
    Routes
} from "@angular/router";
import { appRoutePaths } from "./app.routes";
import { AuthRouteGuard } from "./core/route-guard/auth.route-guard";
import { WellcomePageComponent } from './wellcome-page/wellcome-page.component';

const PROVIDERS = [
    {
        provide: APP_BASE_HREF,
        useValue: "/"
    }
];

const routes: Routes = [
    //////////////////////////////////////////////////
    // Unprotected Routes
    //////////////////////////////////////////////////
    {
        path: appRoutePaths.login,
        loadChildren: "./auth/login/login.module#LoginModule"
    },
    {
        path: appRoutePaths.register,
        loadChildren: "./auth/register/register.module#RegisterModule"
    },
    {
        path: appRoutePaths.wellcome,
        component: WellcomePageComponent
    },


    //////////////////////////////////////////////////
    // Protected Routes
    //////////////////////////////////////////////////
    {
        path: appRoutePaths.patients,
        loadChildren: "./dem/patient-management/patients-list/patients.module#PatientsModule",
        canActivate: [AuthRouteGuard]
    },

    {
        path: appRoutePaths.editPatient,
        loadChildren: "./dem/patient-management/patient-form/patient-form.module#PatientFormModule",
        canActivate: [AuthRouteGuard]
    },
    {
        path: appRoutePaths.patientTests,
        loadChildren: "./dem/patient-management/patient/patient.module#PatientModule",
        canActivate: [AuthRouteGuard]
    },
    {
        path: appRoutePaths.subTests,
        loadChildren: "./dem/patient-management/test/test.module#TestModule",
        canActivate: [AuthRouteGuard]
    },
    //////////////////////////////////////////////////
    // Redirects
    //////////////////////////////////////////////////
    {
        path: "**",
        pathMatch: "full",
        redirectTo: appRoutePaths.wellcome
    }
];

@NgModule({
    imports: [
        /**
         * Configure the router for the application.
         *
         * NOTE: Use `enableTracing: true` to see Angular built-in router logging.
         */
        RouterModule.forRoot(routes, { useHash: false, enableTracing: false })
    ],
    exports: [ RouterModule ],
    providers: PROVIDERS
})
export class AppRoutingModule {
}
