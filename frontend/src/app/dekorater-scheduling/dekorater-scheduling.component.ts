import { Component } from '@angular/core';
import Job from '../models/job';
import { CompanyService } from '../services/company.service';
import User from '../models/user';
import { UserService } from '../services/user.service';
import Company from '../models/company';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-dekorater-scheduling',
  templateUrl: './dekorater-scheduling.component.html',
  styleUrls: ['./dekorater-scheduling.component.css']
})
export class DekoraterSchedulingComponent {

  constructor(private companyService: CompanyService, private userService: UserService, private router: Router,
    private adminService: AdminService) { }

  ngOnInit(): void {
    if (!localStorage.getItem('ulogovan')) {
      alert('Niste ulogovani!');
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUser(localStorage.getItem('ulogovan')).subscribe((response) => {
      this.loggedUser = response.user;
      this.getJobs();
    });
  }

  loggedUser: User;
  pendingJobs: Job[] = [];
  selectedJob: Job = null;
  cancelReason: string = '';
  inProgressJobs: Job[] = [];
  jobsWithoutPhoto: Job[] = [];

  getJobs(): void {
    this.companyService.getJobs().subscribe((jobs: Job[]) => {
      this.pendingJobs = jobs.filter((job => ((job.status === 'odbijen' && job.decorator != this.loggedUser.username) || job.status === 'cekanje') && job.company === this.loggedUser.company)).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
      this.inProgressJobs = jobs.filter(job => job.status === 'prihvacen' && job.company == this.loggedUser.company).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
      this.jobsWithoutPhoto = jobs.filter(job => job.status === 'zavrsen' && !job.photo && job.decorator == this.loggedUser.username);
    });
  }

  cancel(job: Job): void {
    this.selectedJob = job;
  }

  close(): void {
    this.selectedJob = null;
    this.cancelReason = '';
  }

  isDateInVacationPeriod(selectedDate: Date): boolean {
    if (!this.company) return false;
    //const selectedDate = new Date();

    const vacationFrom = new Date(this.company.vacationPeriod.from);
    const vacationTo = new Date(this.company.vacationPeriod.to);

    return selectedDate >= vacationFrom && selectedDate <= vacationTo;
  }
  company: Company = new Company();
  message: string = '';
  errorMessage: string = '';

  submit(job: Job): void {
    if(this.loggedUser.canTakeJob === 'blokiran'){
      this.errorMessage = 'Niste uneli sliku na vreme. Vas nalog je blokiran za dalje prihvatanje posla.';
      return;
    }
    if (job.productionDate == null) {
      this.errorMessage = 'Morate uneti datum pocetka rada!';
      return;
    }

    this.companyService.getCompany(job.company).subscribe((response) => {
      if (response.message === 'Firma uspesno nadjena') {
        this.company = response.company;

        const currentDate = new Date();
        if (this.isDateInVacationPeriod(currentDate)) {
          this.errorMessage = 'Firma je tad u periodu godisnjeg odmora';
          return;
        }
        this.selectedJob = job;
        const acceptedJob = {
          ...this.selectedJob,
          status: 'prihvacen',
          decorator: this.loggedUser.username
        };

        this.companyService.updateJob(acceptedJob).subscribe((response) => {
          this.pendingJobs = this.pendingJobs.filter(thisJob => thisJob !== this.selectedJob);
          this.loggedUser.scheduler.push(this.selectedJob.productionDate);
          this.userService.updateUser(this.loggedUser).subscribe((response) => {
            console.log(response.message);
            this.ngOnInit();
          });
          this.close();
        });
      } else {
        console.log(response.message);
      }
    });
  }


  finish(job: Job): void {
    if (job.finishedDate == null) {
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

  selectedFile: File = null;
  photo: string = '';

  onFileSelected(event: any, job: Job) {
    const file: File = event.target.files[0];

    if (file) {
      const img = new Image();
      img.src = window.URL.createObjectURL(file);

      img.onload = () => {

        window.URL.revokeObjectURL(img.src);

        this.selectedFile = file;
        job.photo = URL.createObjectURL(this.selectedFile);
        this.errorMessage = '';
      };
    }
  }

  messagePhoto: string = '';
  errorPhoto: string = '';

  uploadPhoto(job: Job) {
    if (!job.photo) {
      this.errorPhoto = 'Molimo vas da priložite sliku pre potvrđivanja posla.';
      return;
    }

    const formData = new FormData();
    formData.append('photo', this.selectedFile, this.selectedFile.name);
    formData.append('_id', job._id);

    this.companyService.uploadJobPhoto(formData).subscribe(response => {
      if (response.message === 'Slika je uspesno dodata.') {
        this.messagePhoto = response.message;
        this.ngOnInit();
      } else {
        this.errorPhoto = response.message;
      }
    });


  }

}
