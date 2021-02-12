import { NgModule } from "@angular/core";
import { ApiEndpointService } from "./api-endpoint.service";
import { PatientService } from "./patient.service";
import { TestService } from "./test.service";
import { IoService } from "./io.service";
import { FileService } from "./file.service";

const PROVIDERS = [
    ApiEndpointService,
    PatientService,
    IoService,
    FileService
];

@NgModule({
    providers: PROVIDERS
})
export class ServiceModule {
}
