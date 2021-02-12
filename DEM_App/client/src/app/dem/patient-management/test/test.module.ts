import { NgModule } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { TestRoutingModule } from "./test-routing.module";
import { TestComponent } from "./test.component";
import { TestContainer } from "./test.container";
import { UploadAudioFileComponent } from "./upload-audio-file/upload-audio-file.component";
import { TestCardComponent } from "./test-card/test-card.component"
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';

const MODULES = [
    SharedModule,
    TestRoutingModule,
    ReactiveFormsModule
];

const COMPONENTS: any = [
    TestContainer,
    TestComponent,
    UploadAudioFileComponent,
    TestCardComponent,
    LoaderComponent
];

@NgModule({
    imports: MODULES,
    exports: COMPONENTS,
    declarations: COMPONENTS
})
export class TestModule {
}
