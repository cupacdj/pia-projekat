import { Component } from '@angular/core';
import Job from '../models/job';
import { CompanyService } from '../services/company.service';
import User from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dekorater-scheduling',
  templateUrl: './dekorater-scheduling.component.html',
  styleUrls: ['./dekorater-scheduling.component.css']
})
export class DekoraterSchedulingComponent {

  constructor(private companyService: CompanyService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser(localStorage.getItem('ulogovan')).subscribe((response) => {
      this.loggedUser = response.user;
    });
    this.getJobs();
  }
  loggedUser: User;
  pendingJobs: Job[] = [];
  selectedJob: Job = null;
  cancelReason: string = '';
  inProgressJobs: Job[] = [];

  getJobs(): void {
    this.companyService.getJobs().subscribe((jobs: Job[]) => {
      this.pendingJobs = jobs.filter(job => job.status === 'cekanje' && job.company == this.loggedUser.company).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());;
      this.inProgressJobs = jobs.filter(job => job.status === 'prihvacen' && job.company == this.loggedUser.company).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    });
  }

  cancel(job: Job): void {
    this.selectedJob = job;
  }

  close(): void {
    this.selectedJob = null;
    this.cancelReason = '';
  }

  message: string = '';s

  submit(job: Job): void {
    if(job.productionDate == null){
      this.message = 'Morate uneti datum pocetka rada!';
      return
    }
    this.selectedJob = job;
    const acceptedJob = {
      ...this.selectedJob,
      status: 'prihvacen',
      decorator: this.loggedUser.username
    };

    this.companyService.updateJob(acceptedJob).subscribe((response) => {
      this.pendingJobs = this.pendingJobs.filter(thisJob => thisJob !== this.selectedJob);
      this.loggedUser.scheduler.push(this.selectedJob.productionDate)
      this.userService.updateUser(this.loggedUser).subscribe((response) => {
        console.log(response.message);
        this.ngOnInit();
      })
      this.close();
    });
  }

  finish(job: Job): void {
    if(job.finishedDate == null){
      this.message = 'Morate uneti datum zavrsetka rada!';
      return
    }
    this.selectedJob = job;
    const finishedJob = {
      ...this.selectedJob,
      status: 'zavrsen',
      decorator: this.loggedUser.username
    };

    this.companyService.updateJob(finishedJob).subscribe((response) => {
      this.inProgressJobs = this.inProgressJobs.filter(thisJob => thisJob !== this.selectedJob);
      this.close();
      this.ngOnInit();
    });
  }

  cancelJob(): void {
    if (this.selectedJob) {
      const canceledJob = {
        ...this.selectedJob,
        status: 'odbijen',
        rejectionComment: this.cancelReason,
        decorator: this.loggedUser.username
      };

      this.companyService.updateJob(canceledJob).subscribe((response) => {
        this.pendingJobs = this.pendingJobs.filter(thisJob => thisJob !== this.selectedJob);
        this.close();
        this.ngOnInit();
      });
    }
  }


}
