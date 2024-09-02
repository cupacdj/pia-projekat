import { Component } from '@angular/core';
import Job from '../models/job';
import { CompanyService } from '../services/company.service';
import { LayoutObject } from '../models/layout-data';

@Component({
  selector: 'app-owner-maintenance',
  templateUrl: './owner-maintenance.component.html',
  styleUrls: ['./owner-maintenance.component.css']
})
export class OwnerMaintenanceComponent {

  constructor(private companyService: CompanyService) { }

  completedJobs: Job[] = [];
  loggedUser: string = localStorage.getItem('ulogovan');
  pool: boolean = false;
  maintenanceJobs: Job[] = [];
  updateJobs: Job[] = [];

  ngOnInit() {
    this.fetchJobs();
    this.completedJobs.filter(job => job.maintenance === 'u procesu').forEach(job => {
      if (new Date(job.maintenanceCompletitionDate).getTime() < new Date().getTime()) {
        job.maintenance = 'nije potrebno';
        this.companyService.updateJob(job).subscribe((res) => {
          console.log(res);
        });
      }
    })
    this.fetchJobs();
  }

  fetchJobs() {
    this.companyService.getJobs().subscribe((jobs: Job[]) => {
      this.completedJobs = jobs.filter(job => job.status === 'zavrsen' && job.owner === this.loggedUser);
      this.maintenanceJobs = jobs.filter(job => (job.maintenance === 'cekanje' || job.maintenance === 'u procesu') && job.owner === this.loggedUser);
      this.completedJobs.forEach(job => {
        console.log(job.layoutData);
        job.poolCount = this.countPools(job.layoutData.objects);
        job.fountainCount = this.countFountains(job.layoutData.objects);
        this.companyService.updateJob(job).subscribe((res) => {
          console.log(res);
        });
      });
    });
  }


  countPools(layoutData: LayoutObject[]): number {
    let count = layoutData.filter(obj => obj.type === 'rectangle' && obj.color === 'blue').length;

    return count
  }

  countFountains(layoutData: LayoutObject[]): number {
    let count = layoutData.filter(obj => obj.type === 'circle' && obj.color === 'blue').length;
    return count
  }

  canScheduleServicing(job: Job): boolean {
    const finishedDate = new Date(job.finishedDate);
    const lastMaintenanceDate = job.maintenanceCompletitionDate ? new Date(job.maintenanceCompletitionDate) : null;
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

  scheduleServicing(job: any) {
    this.maintenance = true;
    this.selectedJob = job;

  }

  submitMaintenanceDate(){
    this.selectedJob.maintenanceDate = this.date;
    this.selectedJob.maintenance = 'cekanje';
    this.companyService.updateJob(this.selectedJob).subscribe((res) => {
      console.log(res);
      this.maintenance = false;
      this.ngOnInit();
  })
}

}


