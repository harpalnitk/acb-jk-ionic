import { Subscription } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-address-picker',
  templateUrl: './address-picker.component.html',
  styleUrls: ['./address-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AddressPickerComponent,
    },
  ],
})
export class AddressPickerComponent implements ControlValueAccessor, OnDestroy {
  form: FormGroup = this.fb.group({
    addressLine1: [null, [Validators.required]],
    addressLine2: [null, [Validators.required]],
    zipCode: [null, [Validators.required]],
    city: [null, [Validators.required]],
    state: [null, [Validators.required]],
  });

  onChangeSubscription: Subscription;

  //empty function because if by some way getOntoushed calls before
  // it will not cause any problem
  onTouched = () => {};

  constructor(private fb: FormBuilder) {}

  writeValue(value: any): void {
    if (value) {
      this.form.setValue(value);
    }
  }
  registerOnChange(onChange: any): void {
    //this.form.valueChanges.subscribe((value) => onChange(value));

    // to write this in another way

    this.onChangeSubscription = this.form.valueChanges.subscribe(onChange);
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }
  ngOnDestroy(): void {
    if (this.onChangeSubscription) {
      this.onChangeSubscription.unsubscribe();
    }
  }
}
