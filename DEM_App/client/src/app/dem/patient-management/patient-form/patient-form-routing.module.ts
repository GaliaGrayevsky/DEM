import { NgModule } from "@angular/core";
import {
    RouterModule,
    Routes
} from "@angular/router";
import { PatientFormContainer } from "./patient-form.container";

const routes: Routes = [
    {
        path: "",
        component: PatientFormContainer
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class LoginRoutingModule {
}
