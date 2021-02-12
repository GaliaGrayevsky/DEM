import { NgModule } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { PatientsListComponent } from "./patients-list.component";
import { PatientsListContainer } from "./patients-list.container";
import { PatientsRoutingModule } from "./patients-routing.module";

const MODULES = [
    SharedModule,
    PatientsRoutingModule
];

const COMPONENTS: any = [
    PatientsListComponent,
    PatientsListContainer
];

@NgModule({
    imports: MODULES,
    exports: COMPONENTS,
    declarations: COMPONENTS
})
export class PatientsModule {
}
