import {
  Compiler,
  ComponentFactory,
  Injectable,
  Injector,
  NgModuleFactory,
  Type
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ComponentModuleLoaderService {
  constructor(private compiler: Compiler, private injector: Injector) {}

  async loadComponentModule<T>(
    loadModuleCallback: () => Promise<Type<any> | NgModuleFactory<any>>,
    injector?: Injector
  ): Promise<ComponentFactory<T>> {
    // create the module factory from the loaded module
    const moduleFactory = await this.createModuleFactory(
      await loadModuleCallback()
    );

    // create the module reference and provide flexibility of what injector to provide
    const moduleRef = moduleFactory.create(injector || this.injector);

    // by adding the `entry` static prop to the lazy loaded module we
    // can easily get a reference of the component we want to work with
    const component = (moduleFactory.moduleType as any).entry as Type<T>;

    // retrieve and return the factory object that creates a component of the given type.
    return moduleRef.componentFactoryResolver.resolveComponentFactory(
      component
    );
  }

  // this is the logic taken from the angular router code 🙌
  private async createModuleFactory<T>(t: Type<T> | NgModuleFactory<T>) {
    // AOT compiled module
    if (t instanceof NgModuleFactory) {
      return t;
    }
    // JIT compiled module
    else {
      return await this.compiler.compileModuleAsync<T>(t);
    }
  }
}
