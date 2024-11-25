import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
 
@Input() showAlert:boolean=false
@Input() alertMessage:string=''
@Input() classText:string=''
@Input() alertText:string=''


}
