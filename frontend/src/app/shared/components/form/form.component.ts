import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  @Input() label: string = ''
  @Input() tooltip: string = ''
  @Input() Validation: any={}

  getValidationMessage() {

    if(!this.Validation || typeof this.Validation!=='object'){
      return ""
    }

   const errors=Object.keys(this.Validation)
   if(errors.length !==0){
    if(errors[0]==='required'){
      return "This field is required."
    }else if(errors[0]==='minlength'){
      return `Minimum character required is ${this.Validation[errors[0]].requiredLength}.`
    }else if(errors[0]==='pattern'){
      return "Enter a valid format."
    }else if(errors[0]==='noMatch'){
      return "Password did not match."
    }
   }
   return ""
  }
}
