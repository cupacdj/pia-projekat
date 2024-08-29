import { Component } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/user';
import Company from '../models/company';
import { AdminService } from '../services/admin.service';
import { CompanyService } from '../services/company.service';
import Job from '../models/job';
import { Time } from "@angular/common";

interface LayoutObject {
  type: 'rectangle' | 'circle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
};

interface LayoutData {
  objects: LayoutObject[];
};

@Component({
  selector: 'app-owner-company',
  templateUrl: './owner-company.component.html',
  styleUrls: ['./owner-company.component.css']
})


export class OwnerCompanyComponent {

  constructor(private router: Router, private adminService: AdminService, private companyService: CompanyService) { }

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
    this.currentStep = 0;
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
    this.currentStep = 1;
  }

  back() {
    this.showDetails = false;
    this.currentStep = 0;
    this.step1Data = null;
    this.step2Data = null;
  }

  currentStep: number = 1;


  errorForm: string = '';

  nextStep() {
    if (this.isDateInVacationPeriod(new Date(this.step1Data.date))) {
      this.errorForm = 'Izabrani datum pada u period godišnjeg odmora firme. Molimo izaberite drugi datum.';
    } else if (this.step1Data.area < 0) {
      this.errorForm = 'Površina baste ne može biti negativna.';
    } else if (this.step1Data.date && this.step1Data.time && this.step1Data.area && this.step1Data.gardenType) {
      this.errorForm = null;
      this.currentStep++;
    } else {
      this.errorForm = 'Molimo popunite sva polja.';
    }
  }

  isDateInVacationPeriod(selectedDate: Date): boolean {
    if (!this.selectedCompany) return false;

    const vacationFrom = new Date(this.selectedCompany.vacationPeriod.from);
    const vacationTo = new Date(this.selectedCompany.vacationPeriod.to);

    return selectedDate >= vacationFrom && selectedDate <= vacationTo;
  }

  step1Data = {
    date: null as Date,
    time: null as Time,
    area: 0,
    gardenType: ''
  };

  step2Data = {
    poolArea: 0,
    greenArea: 0,
    furnitureArea: 0,
    fountainArea: 0,
    tables: 0,
    chairs: 0,
    additionalRequests: '',
    selectedServices: [] as string[],
    layoutData: {} as LayoutData
  };

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isAreaValid(): boolean {
    let totalArea = 0;
    if (this.step1Data.gardenType === 'private') {
      totalArea = this.step2Data.poolArea + this.step2Data.greenArea + this.step2Data.furnitureArea;
    } else if (this.step1Data.gardenType === 'restaurant') {
      totalArea = this.step2Data.fountainArea + this.step2Data.greenArea;
    }
    return totalArea === this.step1Data.area;
  }

  toggleService(serviceName: string) {
    const index = this.step2Data.selectedServices.indexOf(serviceName);
    if (index === -1) {
      this.step2Data.selectedServices.push(serviceName);
    } else {
      this.step2Data.selectedServices.splice(index, 1);
    }
  }

  isServiceSelected(serviceName: string): boolean {
    return this.step2Data.selectedServices.includes(serviceName);
  }

  job: Job;

  submit() {
    const filteredDecorators = this.decorators.filter(decorator => decorator.company === this.selectedCompany.name);
    const DecoratorAvailable = filteredDecorators.filter(decorator => decorator.scheduler.some(date => date.toDateString() === this.step1Data.date.toDateString()));
    if (DecoratorAvailable.length === 0) {
      this.errorForm = 'Nema slobodnih dekoratera za izabrani datum.';
      return;
    }
    if (this.step2Data.chairs < 0 || this.step2Data.tables < 0) {
      this.errorForm = 'Broj stolova i stolica ne može biti negativan.';
      return;
    }
    if (!this.isAreaValid()) {
      this.errorForm = 'Zbir unetih kvadratura ne odgovara ukupnoj kvadraturi iz prvog koraka.';
      return;
    }
    this.job = {
      company: this.selectedCompany.name,
      appointmentDate: this.step1Data.date,
      appointmentTime: this.step1Data.time,
      productionData: null,
      finishedDate: null,
      area: this.step1Data.area,
      gardenType: this.step1Data.gardenType,
      poolArea: this.step2Data.poolArea,
      greenArea: this.step2Data.greenArea,
      furnitureArea: this.step2Data.furnitureArea,
      fountainArea: this.step2Data.fountainArea,
      tables: this.step2Data.tables,
      chairs: this.step2Data.chairs,
      additionalRequests: this.step2Data.additionalRequests,
      selectedServices: this.step2Data.selectedServices,
      layoutData: this.step2Data.layoutData,
      //decorators: filteredDecorators.map(decorator => decorator.username),
      status: 'cekanje',
      grade: 0,
      comment: '',
      rejectionComment: ''
    }
    this.companyService.createJob(this.job).subscribe((response) => {
      if (response.message == 'Posao je uspesno zakazan.') {
        this.errorForm = null;
        this.currentStep++;
      } else {
        this.errorForm = 'Došlo je do greške prilikom kreiranja posla.';
      }
    })
  }



  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const layoutData = JSON.parse(e.target.result);
          this.step2Data.layoutData = layoutData;
          this.draw(layoutData);
        } catch (error) {
          this.errorForm = "Invalid JSON file. " + error;
        }
      };
      reader.readAsText(selectedFile);
    }
  }

  draw(layoutData: any) {
    const canvas = <HTMLCanvasElement>document.getElementById('gardenCanvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      layoutData.objects.forEach((obj: any) => {
        if (obj.type === 'rectangle') {
          ctx.fillStyle = obj.color || 'black';
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        } else if (obj.type === 'circle') {
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
          ctx.fillStyle = obj.color || 'black';
          ctx.fill();
        }
      });
    }
  }

}
