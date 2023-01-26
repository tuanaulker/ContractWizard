import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TableDialogComponent } from 'src/app/dialogs';
import { Base } from 'src/app/interfaces/base';

import { MyDate } from 'src/app/interfaces/myDate';
import { Result } from 'src/app/interfaces/result';
import { RoomType } from 'src/app/interfaces/roomType';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})


export class TableComponent implements OnInit {

  constructor(private dialog: MatDialog,) {
    this.minDate = new Date(0, 0, 0);

  }

  startDate: Date
  endDate: Date;
  minDate: Date;
  inputCode: string;
  inputName: string;
  priceMultiplier1: number;
  priceMultiplier2: number;
  priceMultiplier3: number;
  numberofRoomType: number = 0;
  dates: MyDate[] = [];
  bases: Base[] = [];
  baseDt: Base[] = [];
  colDate: string;
  baseData = new MatTableDataSource<Base>([]);
  baseColumns: string[] = ['actions', 'code', 'name'];
  dateColumns: string[] = [];
  roomTypeColumns: string[] = ['code', 'name', 'price1', 'price2', 'price3'];
  roomTypes: RoomType[] = [];
  roomTypeData = new MatTableDataSource<RoomType>([]);
  dateData = new MatTableDataSource<MyDate>([]);
  dateColumnsP2: string[] = ['beginDate', 'endDate'];
  resultData = new MatTableDataSource<Result>([]);
  resultColumn: string[] = [];
  results: Result[] = [];
  baseDateColumn: string[] = ['date'];
  basesNum: number[] = [];
  isDisabled: boolean = false;
  dialogUpdated: boolean = false;

  ngOnInit(): void {

    if (this.dialogUpdated == true) {
      this.roomTypeData.data = this.roomTypeData.data;
      this.dateData.data = this.dateData.data;
      this.baseData.data = this.baseData.data;
      this.resultData.data = this.resultData.data
    }

    this.priceMultiplier1 = 2;  this.priceMultiplier2 = 3 ; this.priceMultiplier3 = 5;
    this.inputCode = 'STD'; this.inputName = "Standard";
    this.basesNum = [10,20,30];
    this.dialogUpdated = false;
  }

  addRoomType() {
    const elemRoom: RoomType = {
      code: this.inputCode,
      name: this.inputName,
      priceMu1: this.priceMultiplier1,
      priceMu2: this.priceMultiplier2,
      priceMu3: this.priceMultiplier3,
      priceName1: 'price 1',
      priceName2: 'price 2',
      priceName3: 'price 3'
    }

    if (elemRoom.code != null && elemRoom.code != null && elemRoom.priceMu1 != null && elemRoom.priceMu2 != null && elemRoom.priceMu3 != null) {
      this.roomTypes.push(elemRoom);
      this.numberofRoomType++;
    }

    this.roomTypeData.data = this.roomTypes;
    this.inputCode = this.inputName = '';
    this.priceMultiplier1 = this.priceMultiplier2 = this.priceMultiplier3 = null;

  }

  addDate() {
    this.isDisabled = true;
    this.results = [];
    if (this.baseDt.length == 0) {
      this.roomTypes.forEach(element => {
        const tempBase: Base = {
          code: element.code,
          name: element.name,
          basePrice: [],
          dateId: 0,
        }
        this.baseDt.push(tempBase);
      });
    }

    this.dateColumns = [];
    
    this.resultColumn= ['code', 'name', 'priceName', 'multiplier'];
    this.baseColumns = ['actions', 'code', 'name',];


    if (this.startDate != null) {
  
      this.takeLastYear(this.startDate);
    }


    const elemDate: MyDate = {
      beginDate: this.startDate,
      endDate: this.endDate
    };

    if (elemDate.beginDate != null) {
      this.dates.push(elemDate);
    }
    else{
      alert("Please enter the date!")
    }

    if (this.dates.length == 1) {
      this.addColumnDate(this.dates[0]);
    }

    for (let i = 0; i < this.dates.length - 1; i++) {
      this.dates[i].endDate = new Date(this.dates[i + 1].beginDate.getTime() - (24 * 60 * 60 * 1000));
      this.addColumnDate(this.dates[i]);
    }
    if (this.dates.length > 1) {
      this.addColumnDate(this.dates[this.dates.length - 1]);
    }
    this.dateData.data = this.dates;


    for (let i = 0; i < this.baseDt.length; i++) {
      this.baseDt[i].basePrice.push(this.basesNum[i]);
    }
    this.baseData.data = this.baseDt;

    this.callPrices();
    this.minDate = new Date(this.startDate.getTime() + (24 * 60 * 60 * 1000));
    this.startDate = null;
    this.endDate = null;

  }

  update(element: Base) {
    const dialog = this.dialog.open(TableDialogComponent, { data: { element: element, dates: this.dateColumns } });
    dialog.afterClosed().subscribe(result => {
      if (result && result != null) {
        var index = this.baseData.data.findIndex(item => item.code == result.code)
        this.baseData.data[index] = result;
        this.baseDt = this.baseData.data;
        this.callPrices();
      }
      console.log(this.resultData.data);
    });
  }

  addRoom(roomId: number, bases: number[]) {
    const elemBase: Base = {
      code: this.roomTypes[roomId].code,
      name: this.roomTypes[roomId].name,
      basePrice: bases,
      dateId: this.dates.length - 1,
    }
    return elemBase;
  }

  createRes(room: RoomType, mul: number, name: string) {
    const elemRes: Result = {
      roomTypecode: room.code,
      roomTypeName: room.name,
      priceName: name,
      multiplier: mul,
      price: this.addPrice(mul, room.code),

    }
    this.results.push(elemRes);

  }
  
  callPrices(){
    this.results = [];
    this.roomTypes.forEach(roomT => {
      this.createRes(roomT, roomT.priceMu1, roomT.priceName1 = 'price 1');
      this.createRes(roomT, roomT.priceMu2, roomT.priceName1 = 'price 2');
      this.createRes(roomT, roomT.priceMu3, roomT.priceName1 = 'price 3');

    });
    this.resultData.data = this.results;
  }

  addPrice(mul: number, code: string) {
    const resPrice: number[] = [];
    for (let a = 0; a < this.dates.length; a++) {
      for (let x = 0; x < this.baseData.data.length; x++) {
        if (this.baseData.data[x].code == code) {
          resPrice.push(this.baseData.data[x].basePrice[a] * mul);
        }
      }
    }
    return resPrice;
  }

  takeLastYear(last: Date) {
    let tempYear = last.getFullYear();
    this.endDate = new Date(tempYear, 11, 31);
  }

  addColumnDate(elemDate: MyDate) {
    this.colDate = "" + elemDate.beginDate.toLocaleDateString('en-GB') + "\n" + elemDate.endDate.toLocaleDateString('en-GB');
    this.dateColumns.push(this.colDate);
    this.resultColumn.push(this.colDate);
    this.baseColumns.push(this.colDate);
  }
}
