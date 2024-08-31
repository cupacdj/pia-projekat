import { Component } from '@angular/core';
import { CompanyService } from '../services/company.service';
import Job from '../models/job';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-scheduling',
  templateUrl: './owner-scheduling.component.html',
  styleUrls: ['./owner-scheduling.component.css']
})
export class OwnerSchedulingComponent {

  pendingJobs: Job[] = [];
  completedJobs: Job[] = [];
  showCommentForm: boolean = false;
  loggedUser: string;
  newComment: string = '';
  newRating: number = 0;
  selectedJob: Job | null = null;
  canceledJobs: Job[] = [];

  constructor(private companyService: CompanyService, private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = localStorage.getItem('ulogovan') || '';
    this.getJobs();
  }

  getJobs(): void {
    this.companyService.getJobs().subscribe((jobs: Job[]) => {
      this.pendingJobs = jobs.filter(job => job.status === 'cekanje' || job.status === 'prihvacen' && job.owner === this.loggedUser).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());;
      this.completedJobs = jobs.filter(job => job.status === 'zavrsen' && job.owner === this.loggedUser).sort((a, b) => {
        const dateA = new Date(a.finishedDate).getTime() || 0;
        const dateB = new Date(b.finishedDate).getTime() || 0;
        return dateB - dateA;
      });
      this.canceledJobs = jobs.filter(job => job.status === 'odbijen' && job.owner === this.loggedUser)
    });
  }

  canCancle(productionDate: Date): boolean {
    if(!productionDate) {
      return true;
    }
    const currentDate = new Date();
    const date = new Date(productionDate);
    date.setDate(date.getDate() - 1);
    return currentDate <= date;
  }

  cancelJob(job: Job) {
    this.companyService.cancelJob(job).subscribe((response) => {
      if (response.message === 'Posao je uspesno otkazan') {
        this.ngOnInit();
      } else {
        this.errorMessage = response.message;
      }
    });
  }

  openCommentForm(job: Job) {
    this.selectedJob = job;
    this.showCommentForm = true;
  }

  closeCommentForm() {
    this.showCommentForm = false;
    this.newComment = '';
    this.newRating = 0;
    this.selectedJob = null;
  }

  rateJob(star) {
    this.newRating = star;
  }

  setRating(rating: number) {
    this.newRating = rating;
  }

  message: string = '';
  errorMessage: string = '';

  submitComment() {
    if (this.selectedJob) {
      this.selectedJob.comment = this.newComment;
      this.selectedJob.grade = this.newRating;
      this.companyService.updateJob(this.selectedJob).subscribe((response) => {
        if (response.message === 'Posao je uspesno azuriran') {
          this.message = response.message;
        } else {
          this.errorMessage = "Doslo je do greske prilikom azuriranja posla";
        }
      });
      this.ngOnInit();
      this.closeCommentForm();
    }
  }

}
