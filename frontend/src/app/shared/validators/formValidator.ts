import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const PasswordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    // debugger
    const password = control.parent?.get('password')?.value
    const confirmPassword = control.parent?.get('confirmPassword')?.value
    return password === confirmPassword ? null : { noMatch: true }
}

