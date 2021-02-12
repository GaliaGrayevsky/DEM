import { NgModule } from "@angular/core";
import {
    RouterModule,
    Routes
} from "@angular/router";
import { PatientsListContainer } from "./patients-list.container";

const routes: Routes = [
    {
        path: "",
        component: PatientsListContainer
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PatientsRoutingModule {
}