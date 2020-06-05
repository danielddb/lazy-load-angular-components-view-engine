import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LazyComponent } from './lazy.component';

@NgModule({
  declarations: [LazyComponent],
  imports: [CommonModule, ReactiveFormsModule],
  entryComponents: [LazyComponent]
})
export class LazyModule {
  static entry = LazyComponent;
}
