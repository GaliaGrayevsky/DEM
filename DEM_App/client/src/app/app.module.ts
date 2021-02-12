import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { WellcomePageComponent } from './wellcome-page/wellcome-page.component';

import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";

import { NavigationModule } from './navigation/navigation.module';

const MODULES = [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    NavigationModule
    // LoginModule,
    // BeerModule
];

const COMPONENTS = [
    AppComponent,
    WellcomePageComponent
];

@NgModule({
    declarations: COMPONENTS,
    imports: MODULES,
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
