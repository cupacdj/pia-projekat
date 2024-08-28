import { Component } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/user';
import Company from '../models/company';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-company-register',
  templateUrl: './company-register.component.html',
  styleUrls: ['./company-register.component.css']
})
export class CompanyRegisterComponent {

  constructor(private router: Router, private adminService: AdminService ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('admin')) {
      alert('Niste autorizovani kao administrator!');
      this.router.navigate(['/login/admin']);
    }
    this.adminService.getUsers().subscribe(
      (user) => {
        if(!user) {
          this.errorMessage = "Neuspesno ucitavanje korisnika!";
          return;
        }
        this.availableDecorators = user.filter((user) => user.type == 'dekorater' && (user.company == '' || user.company == 'undefined'));
      });

  }

  back(){
    this.router.navigate(['/admin']);
  }

  company: Company;
  name: string;
  address: string;
  contact: string;
  availableDecorators: User[] = [];
  decorators: User[] = [];
  decoratorsNames: string[] = [];
  services: {name: string, price: number}[] = [];
  vacationPeriod: { from: Date | null, to: Date | null } = { from: null, to: null }

  newServiceName: string;
  newServicePrice: number;
  errorMessage: string;
  message: string;

  addService() {
    if (this.newServiceName && this.newServicePrice > 0) {
      this.services.push({ name: this.newServiceName, price: this.newServicePrice });

      this.newServiceName = '';
      this.newServicePrice = 0;
    } else {
      this.errorMessage = 'Molimo unesite validne vrednosti za naziv usluge i cenu.';
      this.newServiceName = '';
      this.newServicePrice = 0;
    }
  }

  addDecorator(decorator: User) {
    this.decorators.push(decorator);
    this.decoratorsNames.push(decorator.username);
  }

  isDecoratorSelected(decorator: User): boolean {
    return this.decorators.includes(decorator);
  }

  removeDecorator(index: number) {
    this.decorators.splice(index, 1);
    this.decoratorsNames.splice(index, 1);
  }

  removeService(index: number) {
    this.services.splice(index, 1);
  }

  addCompany() {
    if (this.decorators.length < 2) {
      this.errorMessage = 'Morate dodati dva ili vise dekoratora.';
      return;
    }
    if(this.name == '' || this.address == '' || this.contact == '' || this.services.length == 0 || this.vacationPeriod.from == null || this.vacationPeriod.to == null) {
      this.errorMessage = 'Morate popuniti sva polja.';
      return;
    }

    this.company = new Company();
    this.company.name = this.name;
    this.company.address = this.address;
    this.company.contact = this.contact;
    this.company.decorators = this.decoratorsNames;
    this.company.services = this.services;
    this.company.vacationPeriod = this.vacationPeriod;

    this.adminService.addCompany(this.company).subscribe((response) => {
      if (response.message == 'Firma je uspesno dodata!') {
        this.message = response.message;
        for(let decorator of this.decorators) {
          decorator.company = this.name;
          this.adminService.updateUser(decorator).subscribe((response) => {
          })
        }
      } else {
        this.errorMessage = response.message;
      }
    });
  }

  clearForm() {
    this.name = '';
    this.address = '';
    this.contact = '';
    this.services = [];
    this.vacationPeriod = { from: null, to: null };
    this.newServiceName = '';
    this.newServicePrice = 0;
    this.decoratorsNames = [];
    this.adminService.getUsers().subscribe(
      (user) => {
        if(!user) {
          this.errorMessage = "Neuspesno ucitavanje korisnika!";
          return;
        }
        this.availableDecorators = user.filter((user) => user.type == 'dekorater' && (user.company == '' || user.company == 'undefined'));
      });

    this.message = '';
    this.errorMessage = '';
  }

}
