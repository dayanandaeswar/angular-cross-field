import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';


export interface PostCodeLength {
  key: string
  value: string
}

export interface Country {
  code: string
  name: string
}


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  profileForm!: FormGroup;
  countries!: Country[];
  postalCodeLenght!: PostCodeLength[];
  ngOnInit(): void {
    //You get this from API
    this.countries = JSON.parse('[{"name":"United States","code":"US"},{"name":"India","code":"IN"}]');
    //You get this from API
    this.postalCodeLenght = JSON.parse('[{"value":5,"key":"US"},{"value":6,"key":"IN"}]');

    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: this.formBuilder.group({
        country: ['', Validators.required],
        postalCode: ['', [Validators.required]],
      }, { validators: validatePostCodeLengh('country', 'postalCode', this.postalCodeLenght) }),
    });


  }

  profileFormSubmit() {
    if (this.profileForm.valid) {
      alert('Data validation is successful');
    } else {
      console.log(this.profileForm.get('address.postalCode')?.getError('invalidLength'));
      alert('Please fill all required details');
    }
  }


}


function validatePostCodeLengh(firstControl: string, matcherControl: string, postalCodeLength: PostCodeLength[]): ValidatorFn {


  return (control: AbstractControl): ValidationErrors | null => {

    const sourceValue = control.get(firstControl)?.value;
    const targetValue = control.get(matcherControl)?.value;
    if (sourceValue && targetValue) {
      const matchedRecord = postalCodeLength.find(el => el.key === sourceValue);
      if (matchedRecord?.value !== targetValue.length) {
        control.get(matcherControl)?.setErrors({ invalidLength: "Postal code length must be " + matchedRecord?.value });
      }
    }
    return null
  }
}