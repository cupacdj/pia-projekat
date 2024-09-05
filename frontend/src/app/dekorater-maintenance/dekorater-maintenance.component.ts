import { Component } from '@angular/core';
import Job from '../models/job';
import { CompanyService } from '../services/company.service';
import { UserService } from '../services/user.service';
import User from '../models/user';
import { Time } from '@angular/common';
import Company from '../models/company';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dekorater-maintenance',
  templateUrl: './dekorater-maintenance.component.html',
  styleUrls: ['./dekorater-maintenance.component.css']
})
export class DekoraterMaintenanceComponent {

  constructor(private companyService: CompanyService, private userService: UserService, private router: Router) { }

  loggedUser: User;

  ngOnInit() {
    if (!localStorage.getItem('ulogovan')) {
      alert('Niste ulogovani!');
      this.router.navigate(['/login']);
    }
    this.userService.getUser(localStorage.getItem('ulogovan')).subscribe((response) => {
      this.loggedUser = response.user;


      this.loadMaintenanceRequests();
    });
  }

  maintenanceRequests: Job[] = [];
  selectedRequest: Job = null;
  completionDate: Date = null;
  completionTime: Time = null;

  loadMaintenanceRequests() {
    if (!this.loggedUser || !this.loggedUser.company) {
      return;
    }

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
    this.message = '';
  }

  message: string = '';
  errorMessage: string = '';
  company: Company = new Company();

  isDateInVacationPeriod(selectedDate: Date): boolean {
    if (!this.company) return false;

    const vacationFrom = new Date(this.company.vacationPeriod.from);
    const vacationTo = new Date(this.company.vacationPeriod.to);

    return selectedDate >= vacationFrom && selectedDate <= vacationTo;
  }

  confirmRequest(request: Job) {
    if (this.completionDate && this.completionTime) {
      this.companyService.getCompany(request.company).subscribe((response) => {
        if (response.message === 'Firma uspesno nadjena') {
          this.company = response.company;
        } else {
          console.log(response.message);
        }
      });

      const currentDate = new Date();
      if (this.isDateInVacationPeriod(currentDate)) {
        this.errorMessage = 'Firma je tad u periodu godisnjeg odmora';
        return;
      }

      request.maintenance = 'u procesu';
      request.maintenanceCompletionDate = this.completionDate;
      request.maintenanceCompletionTime = this.completionTime;

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
