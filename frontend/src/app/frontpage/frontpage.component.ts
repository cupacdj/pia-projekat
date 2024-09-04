import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import User from '../models/user';
import Company from '../models/company';
import { CompanyService } from '../services/company.service';
import Job from '../models/job';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})

export class FrontpageComponent {

  constructor(private router: Router, private adminService: AdminService, private companyService: CompanyService) { }


  ngOnInit() {
    this.adminService.getUsers().subscribe((users) => {
      this.users = users;
      this.totalOwners = this.users.filter(user => user.type === 'vlasnik').length;
      this.totalDecorators = this.users.filter(user => user.type === 'dekorater').length;
      this.decorators = this.users.filter(user => user.type === 'dekorater');
    });
    this.adminService.getCompanies().subscribe((companies) => {
      this.companies = companies;
    });
    this.filtered = false;
    this.getJobs();
  }

  jobsPhoto: Job[] = [];

  getJobs() {
    this.companyService.getJobs().subscribe((jobs) => {
      this.totalGardens = jobs.filter(job => job.status === 'zavrsen').length;
      const now = new Date().getTime();

      const getJobTimestamp = (job) => {
        const date = new Date(job.appointmentDate);
        const [hours, minutes] = job.appointmentTime.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);
        return date.getTime();
      };

      this.jobsLastDay = jobs.filter(job => {
        const jobTimestamp = getJobTimestamp(job);
        return jobTimestamp >= now - 86400000 && jobTimestamp <= now;
      }).length;

      this.jobsLastWeek = jobs.filter(job => {
        const jobTimestamp = getJobTimestamp(job);
        return jobTimestamp >= now - 604800000 && jobTimestamp <= now;
      }).length;

      this.jobsLastMonth = jobs.filter(job => {
        const jobTimestamp = getJobTimestamp(job);
        return jobTimestamp >= now - 2592000000 && jobTimestamp <= now;
      }).length;

      this.jobsPhoto = jobs.filter(job => job.photo !== '');
      if (this.jobsPhoto.length < 3) {
        this.message = 'Nema slika za prikaz';
        this.photos = false;
      } else {
        this.jobsPhoto.slice(0, 6).forEach(job => this.loadPhoto(job._id));
        this.message = '';
        this.photos = true;
      }

    });
  }

  message: string = '';
  photos: boolean = true;

  getPhoto(id: string): any {
    console.log("USAO");
    this.companyService.getJobPhoto(id).subscribe((response) => {

      return URL.createObjectURL(response);
    });
  }

  photosLoaded: boolean = false;
  jobPhotos: { [key: string]: string } = {};

  loadPhoto(id: string) {
    this.companyService.getJobPhoto(id).subscribe((response) => {
      const url = URL.createObjectURL(response);
      this.jobPhotos[id] = url;
      this.photosLoaded = true;
    }, (error) => {
      console.error(`Error loading photo for job ${id}:`, error);
    });
  }

  users: User[] = [];
  decorators: User[] = [];
  totalOwners: number = 0;
  totalDecorators: number = 0;
  searchName: string = '';
  searchAddress: string = '';
  filteredCompanies: Company[] = [];
  companies: Company[] = [];
  filteredCompanyNames: string[] = [];
  filteredCompanyAddresses: string[] = [];
  filtered: boolean = false;

  showNameDropdown: boolean = false;
  showAddressDropdown: boolean = false;

  totalGardens: number = 0;
  jobsLastDay: number = 0;
  jobsLastWeek: number = 0;
  jobsLastMonth: number = 0;

  selectCompanyByName(name: string) {
    this.searchName = name;
    this.filterCompanies();
    this.showNameDropdown = false;
    this.filtered = true;
  }

  selectCompanyByAddress(address: string) {
    this.searchAddress = address;
    this.filterCompanies();
    this.showNameDropdown = false;
    this.filtered = true;
  }

  onInputFocus(type: string) {
    if (type === 'name') {
      this.showNameDropdown = true;
      this.showAddressDropdown = false;
    } else if (type === 'address') {
      this.showAddressDropdown = true;
      this.showNameDropdown = false;
    }
  }

  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.form-group')) {
      this.showNameDropdown = false;
      this.showAddressDropdown = false;
    }
  }

  sortByName() {
    this.filteredCompanies = this.companies.sort((a, b) => a.name.localeCompare(b.name));
    this.filtered = true;
  }

  sortByAddress() {
    this.filteredCompanies = this.companies.sort((a, b) => a.address.localeCompare(b.address));
    this.filtered = true;
  }

  filterCompanies() {
    this.filteredCompanies = this.companies.filter(company =>
      company.name.toLowerCase().includes(this.searchName.toLowerCase()) &&
      company.address.toLowerCase().includes(this.searchAddress.toLowerCase())
    );

    this.filteredCompanyNames = this.companies
      .filter(company => company.name.toLowerCase().includes(this.searchName.toLowerCase()))
      .map(company => company.name);

    this.filteredCompanyAddresses = this.companies
      .filter(company => company.address.toLowerCase().includes(this.searchAddress.toLowerCase()))
      .map(company => company.address);

    this.showNameDropdown = !!this.searchName && this.filteredCompanyNames.length > 0;
    this.showAddressDropdown = !!this.searchAddress && this.filteredCompanyAddresses.length > 0;
  }


  filteredDecorators: User[] = [];

  getDecorator(name: string) {
    this.filteredDecorators = this.decorators.filter(decorator => decorator.company == name);
    return this.filteredDecorators
  }

}
