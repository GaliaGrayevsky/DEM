import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationTopBarComponent } from './navigation-top-bar/navigation-top-bar.component';
import { MaterialModule } from '../shared/material/material.module';

const COMPONENTS = [
  NavigationTopBarComponent
];

const MODULES = [
  CommonModule,
  MaterialModule
];


@NgModule({
  declarations: COMPONENTS,
  imports: MODULES,
  exports: COMPONENTS
})
export class NavigationModule { }
