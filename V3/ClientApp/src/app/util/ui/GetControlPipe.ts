import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Pipe({
  name: 'getControl',
  standalone: true,
  pure: true
})
export class GetControlPipe implements PipeTransform {
  transform(form: FormGroup, controlName: string): FormControl {
    return form.get(controlName) as FormControl;
  }
}
