import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { CompanyService } from '../services/company.service';
import Job from '../models/job';
import User from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dekorater',
  templateUrl: './dekorater.component.html',
  styleUrls: ['./dekorater.component.css']
})
export class DekoraterComponent {

  constructor(private router: Router, private adminService: AdminService, private companyService: CompanyService,
    private userService: UserService) { }

  myJobs: Job[] = [];
  loggedUser: User

  ngOnInit(): void {
    if (!localStorage.getItem('ulogovan')) {
      alert('Niste ulogovani!');
      this.router.navigate(['/login']);
    }


    this.userService.getUser(localStorage.getItem('ulogovan')).subscribe((response) => {
      this.loggedUser = response.user;
      localStorage.setItem('tip', this.loggedUser.type);
    });



    this.companyService.getJobs().subscribe((jobs) => {
      this.myJobs = jobs.filter(job => job.decorator == localStorage.getItem('ulogovan'));
      this.myJobs.forEach(job => {
        let now = new Date();
        let finishedDate = new Date(job.finishedDate);
        if ((now.getTime() > finishedDate.getTime() + 86400000) && job.photo == '') {
          this.loggedUser.canTakeJob = 'blokiran';
          this.adminService.updateUser(this.loggedUser).subscribe((response) => {
            alert('Niste uneli sliku na vreme. Vas nalog je blokiran za dalje prihvatanje posla.');
          });
        }
    });

    })


    this.router.navigate(['/dekorater-profile']);
  }


}
