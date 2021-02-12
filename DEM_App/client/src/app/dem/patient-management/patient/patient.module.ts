import { NgModule } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { PatientRoutingModule } from "./patient-routing.module";
import { PatientComponent } from "./patient.component";
import { PatientContainer } from "./patient.container";

const MODULES = [
    SharedModule,
    PatientRoutingModule
];

const COMPONENTS: any = [
    PatientContainer,
    PatientComponent
];

@NgModule({
    imports: MODULES,
    exports: COMPONENTS,
    declarations: COMPONENTS
})
export class PatientModule {
}
