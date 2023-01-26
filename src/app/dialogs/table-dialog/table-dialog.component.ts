import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { Base } from 'src/app/interfaces/base';

interface DialogData {
  element: Base;
  dates: string;
  table: MatTable<any>;
  dialogRef: MatDialogRef<any>;
}

@Component({
  selector: 'app-table-dialog',
  templateUrl: './table-dialog.component.html',
  styleUrls: ['./table-dialog.component.scss']
})

export class TableDialogComponent {
  dates: string = this.data.dates;
  newCode: string = this.data.element.code;
  newName: string = this.data.element.name;
  newBases: number[] = this.data.element.basePrice; 
  disable: boolean = false;

  constructor(    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  public dialogRef: MatDialogRef<TableDialogComponent>){
  }

  update(){
    this.data.element.basePrice = this.newBases;
    this.dialogRef.close(this.data.element);
  }

  close(){
    this.dialogRef.close();
  }

}
