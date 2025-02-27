import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITableColums } from '../../../model/interface/interface';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  @Input() columnsList:ITableColums[]=[]
  @Input() tableData:any[]=[]

  @Output() onEditClick=new EventEmitter()
  @Output() onDeleteClick=new EventEmitter()
  @Output() onColumnClick=new EventEmitter()
  @Output() onApproveClick=new EventEmitter()
  @Output() onStatusClick=new EventEmitter()

  onEdit(){
    this.onEditClick.emit()
  }

  onDelete(){
    this.onDeleteClick.emit()
  }

  columnClick(){
    this.onColumnClick.emit()
  }

  onApprove(){
    this.onApproveClick.emit()
  }

  onSetStatus(){
    this.onStatusClick.emit()
  }

}
