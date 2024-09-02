import { Time } from "@angular/common";
import { LayoutData } from "./layout-data";
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
  layoutData: LayoutData = null;
  status: string = ""; //cekanje, prihvacen, zavrsen, odbijen
  grade: number = 0;
  comment: string = "";
  rejectionComment: string = "";
  poolCount: number = 0;
  fountainCount: number = 0;
  maintenance: string = ""; //cekanje, u procesu, nije potrebno, odbijen
  maintenanceDate: Date;
  maintenanceCompletitionDate: Date;
  maintenanceCompletitionTime: Time;
}
