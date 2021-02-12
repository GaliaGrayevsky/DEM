import { NgModule } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { LoginRoutingModule } from "./patient-form-routing.module";
import { PatientFormComponent } from "./patient-form.component";
import { PatientFormContainer } from "./patient-form.container";

const MODULES = [
    SharedModule,
    LoginRoutingModule
];

const COMPONENTS: any = [
    PatientFormContainer,
    PatientFormComponent
];

@NgModule({
    imports: MODULES,
    exports: COMPONENTS,
    declarations: COMPONENTS
})
export class PatientFormModule {
}
