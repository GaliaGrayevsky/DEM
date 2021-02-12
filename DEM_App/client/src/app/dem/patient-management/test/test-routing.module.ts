import { NgModule } from "@angular/core";
import {
    RouterModule,
    Routes
} from "@angular/router";
import { TestContainer } from "./test.container";

const routes: Routes = [
    {
        path: "",
        component: TestContainer
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class TestRoutingModule {
}
