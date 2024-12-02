import { Component, inject, Input } from '@angular/core';
import { AlertService } from '../../../services/alertService/alert.service';
import { IAlert } from '../../../model/interface/interface';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  @Input() showAlert: boolean = false
  @Input() alertMessage: string = ''
  @Input() alertClass: string = ''
  @Input() alertText: string = ''

  alertService = inject(AlertService)

  constructor() {
    this.alertService.alert$.subscribe((state: IAlert) => {

      // if (state.alertText === "Success!") {
      //   this.alertClass = 'alert alert-success'
      // } else if (state.alertText === "Failed!") {
      //   this.alertClass = 'alert alert-danger'
      // }
      this.showAlert = state.alertOn
      this.alertMessage = state.alertMessage
      this.alertClass = state.alertClass
      this.alertText = state.alertText
    })
  }

}
