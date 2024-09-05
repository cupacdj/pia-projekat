import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { CompanyService } from '../services/company.service';
import Job from '../models/job';
import { UserService } from '../services/user.service';
import User from '../models/user';
import Company from '../models/company';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {

  constructor(private router: Router, private companyService: CompanyService, private userService: UserService,
    private adminService: AdminService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    if (!localStorage.getItem('ulogovan')) {
      alert('Niste ulogovani!');
      this.router.navigate(['/login']);
    }

    this.decorator = localStorage.getItem('ulogovan') || '';
    this.userService.getUser(this.decorator).subscribe((data) => {
      this.loggedUser = data.user;

      this.getCompany();
    })

  }

  loggedUser: User = new User();
  jobs: Job[] = [];
  jobsDecorater: Job[] = [];
  decorator: string = '';
  decorators: string[] = [];
  company: Company = new Company();
  cntJobs: number[] = [];
  companies: Company[] = [];

  getJobs() {
    this.companyService.getJobs().subscribe((data: Job[]) => {
      this.jobs = data;
      this.jobsDecorater = data.filter(job => job.decorator === this.decorator);
      this.loadBarChart();
      this.loadPieChart();
      this.loadHistogram();
    });
  }

  getJobsPerDay() {
    const daysOfWeek = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];
    const jobCounts = Array(7).fill(0);
    const today = new Date();
    const twentyFourMonthsAgo = new Date();
    twentyFourMonthsAgo.setMonth(today.getMonth() - 24);


    const jobsInLast24Months = this.jobs.filter(job => {
      const productionDate = new Date(job.productionDate);
      return productionDate >= twentyFourMonthsAgo && productionDate <= today;
    });

    jobsInLast24Months.forEach(job => {
      const productionDate = new Date(job.productionDate);
      const day = (productionDate.getDay() + 6) % 7;  // Pon=0, Uto=1, ..., Ned=6
      jobCounts[day]++;
    });


    const averageJobsPerDayPerMonth = jobCounts.map(count => (count / 24).toFixed(2));

    return averageJobsPerDayPerMonth
  }





  getCompany() {
    console.log(this.loggedUser.company);
    this.companyService.getCompany(this.loggedUser.company).subscribe((response) => {
      if (!response.company) {
        alert(response.message);
        return;
      }
      this.decorators = response.company.decorators;

      this.getJobs();
    });
  }

  getNumberJobs() {
    this.decorators.forEach((decorator, idx) => {
      this.cntJobs[idx] = this.jobs.filter(job => job.decorator === decorator).length
    });
  }

  getJobsPerMonth() {
    const monthCounts = Array(12).fill(0);

    this.jobsDecorater.forEach(job => {
      const productionDate = new Date(job.productionDate);
      const month = productionDate.getMonth();
      monthCounts[month]++;
    });

    return monthCounts;
  }

  loadBarChart() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    const jobsPerMonth = this.getJobsPerMonth();

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'],
        datasets: [{
          label: 'Poslovi po mesecima',
          data: jobsPerMonth,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1

        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  loadPieChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    this.getNumberJobs();
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.decorators,
        datasets: [{
          data: this.cntJobs,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }

    });
  }

  loadHistogram() {
    const ctx = document.getElementById('histogramChart') as HTMLCanvasElement;
    const data = this.getJobsPerDay();
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pon', 'Uto', 'Sre', 'Cet', 'Pet', 'Sub', 'Ned'],
        datasets: [{
          label: 'Broj poslova po danima u nedelji u poslednjih 24 meseca',
          data: data,
          backgroundColor: 'rgba(153, 102, 255, 0.8)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          barPercentage: 1.0,
          categoryPercentage: 1.0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: true
            },
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }


}
