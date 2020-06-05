import {
  Component,
  Injector,
  ViewChild,
  ViewContainerRef,
  ComponentRef
} from '@angular/core';
import { LazyComponent } from './lazy/lazy.component';
import { ComponentModuleLoaderService } from './component-module-loader.service';

// Map of component modules to load
const componentModules = {
  lazy: () => import('./lazy/lazy.module').then((m) => m.LazyModule)
};

@Component({
  selector: 'app-root',
  template: `
    <div>
      <button (click)="lazyLoad()">Lazy Load</button>

      <div #vcr></div>
    </div>
  `
})
export class AppComponent {
  @ViewChild('vcr', { read: ViewContainerRef }) vcr: ViewContainerRef;

  private componentRef: ComponentRef<LazyComponent>;

  constructor(
    private loader: ComponentModuleLoaderService,
    public injector: Injector
  ) {}

  async lazyLoad() {
    // don't do anything if the component ref already exists
    if (this.componentRef) {
      return;
    }

    // lazy load the component module 🚀 and return us the component factory
    const factory = await this.loader.loadComponentModule<LazyComponent>(
      componentModules.lazy,
      this.injector
    );

    // instantiate the component and insert it into the container view
    const ref = this.vcr.createComponent(factory);

    // as we have a reference to the lazy loaded component, we can access the instance methods
    // also... don't forget to unsubscribe to any subscriptions 👀!
    ref.instance.messageChanges.subscribe(console.log);
    ref.instance.messageControl.setValue('Hi!');
  }
}
