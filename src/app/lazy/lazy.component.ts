import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  template: '<input type="text" [formControl]="messageControl" />'
})
export class LazyComponent {
  messageControl = new FormControl('');

  messageChanges = this.messageControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );
}
