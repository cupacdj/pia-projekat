import { Component } from '@angular/core';
import Job from '../models/job';
import { CompanyService } from '../services/company.service';
import { LayoutObject } from '../models/layout-data';
import Company from '../models/company';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-maintenance',
  templateUrl: './owner-maintenance.component.html',
  styleUrls: ['./owner-maintenance.component.css']
})
export class OwnerMaintenanceComponent {

  constructor(private companyService: CompanyService, private userService: UserService, private router: Router) { }

  completedJobs: Job[] = [];
  loggedUser: string = localStorage.getItem('ulogovan');
  pool: boolean = false;
  maintenanceJobs: Job[] = [];
  updateJobs: Job[] = [];
  company: Company = new Company();

  ngOnInit() {
    if (!localStorage.getItem('ulogovan')) {
      alert('Niste ulogovani!');
      this.router.navigate(['/login']);
    }
    this.fetchJobs();
  }

  fetchJobs() {
    this.companyService.getJobs().subscribe((jobs: Job[]) => {
      this.completedJobs = jobs.filter(job => job.status === 'zavrsen' && job.owner === this.loggedUser);
      this.maintenanceJobs = jobs.filter(job => (job.maintenance === 'cekanje' || job.maintenance === 'u procesu') && job.owner === this.loggedUser);
      this.completedJobs.forEach(job => {
        job.poolCount = this.countPools(job.layoutData.objects);
        job.fountainCount = this.countFountains(job.layoutData.objects);
        this.companyService.updateJob(job).subscribe((res) => {
        });
      });
    });

  }


  countPools(layoutData: LayoutObject[]): number {
    let count = layoutData.filter(obj => obj.type === 'rectangle' && obj.color === 'blue').length;
    this.completedJobs.filter(job => job.maintenance === 'u procesu').forEach(job => {
      console.log(new Date(job.maintenanceCompletionDate).getTime());
      console.log(new Date().getTime())
      if (new Date(job.maintenanceCompletionDate).getTime() < new Date().getTime()) {
        job.maintenance = 'nije potrebno';
        this.companyService.updateJob(job).subscribe((res) => {
        });
      }
    })
    return count
  }

  countFountains(layoutData: LayoutObject[]): number {
    let count = layoutData.filter(obj => obj.type === 'circle' && obj.color === 'blue').length;
    return count
  }

  isDateInVacationPeriod(selectedDate: Date): boolean {
    if (!this.company) return false;
    //const selectedDate = new Date();

    const vacationFrom = new Date(this.company.vacationPeriod.from);
    const vacationTo = new Date(this.company.vacationPeriod.to);

    return selectedDate >= vacationFrom && selectedDate <= vacationTo;
  }

  canScheduleServicing(job: Job): boolean {

    const finishedDate = new Date(job.finishedDate);
    const lastMaintenanceDate = job.maintenanceCompletionDate ? new Date(job.maintenanceCompletionDate) : null;
    const currentDate = new Date();


    const sixMonthsInMilliseconds = 6 * 30 * 24 * 60 * 60 * 1000;

    if (lastMaintenanceDate) {
      return (currentDate.getTime() - lastMaintenanceDate.getTime()) > sixMonthsInMilliseconds;
    }

    return (currentDate.getTime() - finishedDate.getTime()) > sixMonthsInMilliseconds;
  }

  maintenance: boolean = false;
  date: Date;
  selectedJob: Job;

  scheduleServicing(job: Job) {

    this.maintenance = true;
    this.selectedJob = job;

  }

  errorMessage: string = '';

  submitMaintenanceDate() {
    this.companyService.getCompany(this.selectedJob.company).subscribe((response) => {
      if (response.message === 'Firma uspesno nadjena') {
        this.company = response.company
      } else {
        console.log(response.message);
      }
    })
    const currentDate = new Date();
    if (this.isDateInVacationPeriod(currentDate)) {
      this.errorMessage = 'Firma je tad u periodu godisnjeg odmora';
      return;
    }
    this.selectedJob.maintenanceDate = this.date;
    this.selectedJob.maintenance = 'cekanje';
    this.companyService.updateJob(this.selectedJob).subscribe((res) => {
      this.maintenance = false;
      this.ngOnInit();
    })
  }

  close(): void {
    this.maintenance = false;
    this.date = null;
    this.errorMessage = '';
  }

}


