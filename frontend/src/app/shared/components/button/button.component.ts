import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {

  @Input() btnClass: string = ''
  @Input() btnTitle: string=''

  @Output() onBtnClick = new EventEmitter()

  onClick() {
    this.onBtnClick.emit()
  }


}
