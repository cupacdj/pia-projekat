import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import User from '../models/user';
import Company from '../models/company';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})

export class FrontpageComponent {

  constructor(private router: Router, private adminService: AdminService) { }


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

  // filterCompaniesByName() {
  //   if (this.searchName) {
  //     this.filteredCompanyNames = this.companies
  //       .map(company => company.name)
  //       .filter(name => name.toLowerCase().includes(this.searchName.toLowerCase()));

  //     this.filteredCompanies = this.companies.filter(company =>
  //       company.name.toLowerCase().includes(this.searchName.toLowerCase()));
  //   } else {
  //     this.filteredCompanyNames = [];
  //     this.filteredCompanies = this.companies;
  //   }
  // }

  // filterCompaniesByAddress() {
  //   if (this.searchAddress) {
  //     this.filteredCompanyAddresses = this.companies
  //       .map(company => company.address)
  //       .filter(address => address.toLowerCase().includes(this.searchAddress.toLowerCase()));

  //     this.filteredCompanies = this.companies.filter(company =>
  //       company.address.toLowerCase().includes(this.searchAddress.toLowerCase()));
  //   } else {
  //     this.filteredCompanyAddresses = [];
  //     this.filteredCompanies = this.companies;
  //   }
  //   this.filtered = true;
  // }

  showNameDropdown: boolean = false;
  showAddressDropdown: boolean = false;

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
