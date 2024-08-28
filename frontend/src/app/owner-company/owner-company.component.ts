import { Component } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/user';
import Company from '../models/company';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-owner-company',
  templateUrl: './owner-company.component.html',
  styleUrls: ['./owner-company.component.css']
})
export class OwnerCompanyComponent {

  constructor(private router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    if (!localStorage.getItem('ulogovan')) {
      alert('Niste ulogovani!');
      this.router.navigate(['/login']);
    }
    this.adminService.getUsers().subscribe((users) => {
      this.users = users;
      this.decorators = this.users.filter(user => user.type === 'dekorater');
    });
    this.adminService.getCompanies().subscribe((companies) => {
      this.companies = companies;
    });
    this.filtered = false;
    this.showDetails = false;
  }

  users: User[] = [];
  decorators: User[] = [];
  searchName: string = '';
  searchAddress: string = '';
  filteredCompanies: Company[] = [];
  companies: Company[] = [];
  filteredCompanyNames: string[] = [];
  filteredCompanyAddresses: string[] = [];
  filtered: boolean = false;
  showDetails: boolean = false;

  filterCompaniesByName() {
    if (this.searchName) {
      this.filteredCompanyNames = this.companies
        .map(company => company.name)
        .filter(name => name.toLowerCase().includes(this.searchName.toLowerCase()));

      this.filteredCompanies = this.companies.filter(company =>
        company.name.toLowerCase().includes(this.searchName.toLowerCase()));
    } else {
      this.filteredCompanyNames = [];
      this.filteredCompanies = this.companies;
    }
  }

  filterCompaniesByAddress() {
    if (this.searchAddress) {
      this.filteredCompanyAddresses = this.companies
        .map(company => company.address)
        .filter(address => address.toLowerCase().includes(this.searchAddress.toLowerCase()));

      this.filteredCompanies = this.companies.filter(company =>
        company.address.toLowerCase().includes(this.searchAddress.toLowerCase()));
    } else {
      this.filteredCompanyAddresses = [];
      this.filteredCompanies = this.companies;
    }
    this.filtered = true;
  }

  selectCompanyByName(name: string) {
    this.searchName = name;
    this.filterCompaniesByName();
    this.filtered = true;
  }

  selectCompanyByAddress(address: string) {
    this.searchAddress = address;
    this.filterCompaniesByAddress();
    this.filtered = true;
  }

  sortByName() {
    this.filteredCompanies = this.companies.sort((a, b) => a.name.localeCompare(b.name));
    this.filtered = true;
  }

  sortByAddress() {
    this.filteredCompanies = this.companies.sort((a, b) => a.address.localeCompare(b.address));
    this.filtered = true;
  }

  filteredDecorators: User[] = [];

  getDecorator(name: string) {
    this.filteredDecorators = this.decorators.filter(decorator => decorator.company == name);
    return this.filteredDecorators
  }

  selectedCompany: Company;

  viewDetails(company: Company) {
    this.selectedCompany = company;
    this.showDetails = true;
  }

}
