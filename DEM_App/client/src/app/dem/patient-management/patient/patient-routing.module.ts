import { NgModule } from "@angular/core";
import {
    RouterModule,
    Routes
} from "@angular/router";
import { PatientContainer } from "./patient.container";

const routes: Routes = [
    {
        path: "",
        component: PatientContainer
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PatientRoutingModule {
}
