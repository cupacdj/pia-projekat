import { Component } from '@angular/core';
import Job from '../models/job';
import { CompanyService } from '../services/company.service';
import { UserService } from '../services/user.service';
import User from '../models/user';
import { Time } from '@angular/common';

@Component({
  selector: 'app-dekorater-maintenance',
  templateUrl: './dekorater-maintenance.component.html',
  styleUrls: ['./dekorater-maintenance.component.css']
})
export class DekoraterMaintenanceComponent {

  constructor(private companyService: CompanyService, private userService: UserService) { }

  loggedUser: User;

  ngOnInit() {
    this.loadMaintenanceRequests();
    this.userService.getUser(localStorage.getItem('ulogovan')).subscribe((response) => {
      this.loggedUser = response.user;
    })
  }


  maintenanceRequests: Job[] = [];
  selectedRequest: Job = null;
  completionDate: Date = null;
  completionTime: Time = null;

  loadMaintenanceRequests() {
    this.companyService.getJobs().subscribe((jobs: Job[]) => {
      this.maintenanceRequests = jobs.filter(job => job.maintenance === 'cekanje' && job.company === this.loggedUser.company);
    });
  }



  openConfirmModal(request: Job) {
    this.selectedRequest = request;
  }

  closeModal() {
    this.selectedRequest = null;
    this.completionDate = null;
    this.completionTime = null;
    this.message  = '';
  }

  message: string = '';

  confirmRequest(request: Job) {
    if (this.completionDate && this.completionTime) {
      request.maintenance = 'u procesu';
      request.maintenanceCompletitionDate = this.completionDate
      request.maintenanceCompletitionTime = this.completionTime
      this.companyService.updateJob(request).subscribe((res) => {
        this.loadMaintenanceRequests();
        this.closeModal();
        this.message = "Zahtev je prihvacen";
      });
    }
  }

  rejectRequest(request: any) {
    request.maintenance = 'odbijen';
    this.companyService.updateJob(request).subscribe((res) => {
      this.loadMaintenanceRequests();
      this.closeModal();
      this.message = "Zahtev je odbijen";
    });
  }





}
