import { Time } from "@angular/common";

export default class Job {
  company: string = "";
  appointmentDate: Date;
  appointmentTime: Time;
  productionData: Date;
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
  layoutData: any = {};
  //decorators: string[] = [];
  status: string= ""; //cekanje, prihvacen, zavrsen, odbijen
  grade: number = 0;
  comment: string = "";
  rejectionComment: string = "";
}
