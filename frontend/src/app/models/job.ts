import { Time } from "@angular/common";
import { LayoutObject } from '../models/layout-data';
export default class Job {
  owner: string = "";
  decorator: string = "";
  company: string = "";
  appointmentDate: Date;
  appointmentTime: Time;
  productionDate: Date;
  finishedDate: Date
  area: number = 0;
  gardenType: string = ""; //privatna, restoran
  poolArea: number = 0;
  greenArea: number = 0;
  furnitureArea: number = 0;
  fountainArea: number = 0;
  tables: number = 0;
  chairs: number = 0;
  additionalRequests: string = "";
  selectedServices: string[] = [];
  layoutData: {
    type: 'rectangle' | 'circle',
    x: number,
    y: number,
    width?: number,
    height?: number,
    radius?: number,
    color: string,
  }[] = [
      {
        type: 'rectangle',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        color: ''
      }
    ];
  status: string = ""; //cekanje, prihvacen, zavrsen, odbijen
  grade: number = 0;
  comment: string = "";
  rejectionComment: string = "";
}
