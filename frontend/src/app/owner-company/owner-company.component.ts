import { Component } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/user';
import Company from '../models/company';
import { AdminService } from '../services/admin.service';
import { CompanyService } from '../services/company.service';
import Job from '../models/job';
import { Time } from "@angular/common";
import { LayoutData } from '../models/layout-data';


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
    this.companyService.getJobs().subscribe((jobs: Job[]) => {
      this.completedJobs = jobs.filter(job => job.status === 'zavrsen');
    });
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
  completedJobs: Job[] = [];

  showNameDropdown: boolean = false;
  showAddressDropdown: boolean = false;

  averageGradeForCompany(company: Company): number {
    let sum = 0;
    let count = 0;
    this.completedJobs.forEach(job => {
      if (job.company === company.name) {
        sum += job.grade;
        count++;
      }
    });
    return count > 0 ? sum / count : 0;
  }

  getStars(averageGrade: number): number[] {
    const fullStars = Math.floor(averageGrade);
    const halfStar = averageGrade % 1 >= 0.5 ? 0.5 : 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return [
      ...Array(fullStars).fill(1),
      ...Array(halfStar ? 1 : 0).fill(0.5),
      ...Array(emptyStars).fill(0)
    ];
  }

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
    this.step1Data = {
      date: null as Date,
      time: null as Time,
      area: 0,
      gardenType: ''
    };

    this.step2Data = {
      poolArea: 0,
      greenArea: 0,
      furnitureArea: 0,
      fountainArea: 0,
      tables: 0,
      chairs: 0,
      additionalRequests: '',
      selectedServices: [] as string[],
      layoutData: null as LayoutData
    };
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
    if (!this.step1Data.date || !this.step1Data.time || !this.step1Data.area || !this.step1Data.gardenType) {
      this.errorForm = 'Molimo popunite sva polja.';
    } else
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
    layoutData: null as LayoutData
  };

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isAreaValid(): boolean {
    let totalArea = 0;
    if (this.step1Data.gardenType === 'privatno') {
      totalArea = this.step2Data.poolArea + this.step2Data.greenArea + this.step2Data.furnitureArea;
    } else if (this.step1Data.gardenType === 'restoran') {
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

  job: Job = new Job();

  submit() {
    const filteredDecorators = this.decorators.filter(decorator => decorator.company === this.selectedCompany.name);
    const DecoratorAvailable = filteredDecorators.filter(decorator => decorator.scheduler.some(date => date.toDateString() == this.step1Data.date.toDateString()));
    if (DecoratorAvailable.length == filteredDecorators.length) {
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
      _id: '',
      owner: localStorage.getItem('ulogovan'),
      decorator: '',
      company: this.selectedCompany.name,
      appointmentDate: this.step1Data.date,
      appointmentTime: this.step1Data.time,
      productionDate: null,
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
      status: 'cekanje',
      grade: 0,
      comment: '',
      rejectionComment: '',
      poolCount: 0,
      fountainCount: 0,
      maintenance: 'nije potrebno',
      maintenanceDate: null,
      maintenanceCompletionDate: null,
      maintenanceCompletionTime: null,
      photo: '',
      photoDate: null
    }
    console.log(this.job);
    this.companyService.createJob(this.job).subscribe((response) => {
      if (response.message == "Posao je uspesno zakazan.") {
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

  jobs: Job[] = [];

  getJobs(): void {
    this.companyService.getJobs().subscribe((jobs: Job[]) => {
      this.jobs = jobs.filter(job => job.status === 'zavrsen' && job.company == this.selectedCompany.name).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    });
  }

}
