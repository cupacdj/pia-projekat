import { Component } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/user';
import { AdminService } from '../services/admin.service';
import Company from '../models/company';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor( private router: Router, private adminService: AdminService, private userService: UserService) { }

  ngOnInit(): void {
    if (!localStorage.getItem('admin')) {
      alert('Niste autorizovani kao administrator!');
      this.router.navigate(['/login/admin']);
    }
    this.selectedUser = null;
  }

  users: User[] = [];
  companies: Company[] = [];
  selectedUser: User = new User();
  errorMessage: string;

  showUsers = false;
  showRegReq = false;
  showCompanies = false;
  show = false;

  usersReq: User[] = [];

  showUserList() {
    this.show = true;
    this.showRegReq = false;
    this.loadUsers('vlasnik');
  }

  showRegistrationRequests() {
    this.showUsers = false;
    this.showRegReq = true;
    this.showCompanies = false;
    this.show = false;
    this.loadRegistrationRequests();
    this.message2 = '';
  }

  loadUsers(type: string) {
    this.showCompanies = false;
    this.showUsers = true;
    this.adminService.getUsers().subscribe(
      (user) => {
        if(!user) {
          this.errorMessage = "Neuspesno ucitavanje korisnika!";
          return;
        }
        this.users = user.filter((user) => user.type == type);
      });
  }

  loadRegistrationRequests() {
    this.adminService.getPendingUsers().subscribe(users => {
      this.usersReq = users;
    });
  }

  message3: string;

  loadCompanies(){
    this.showUsers = false;
    this.showRegReq = false;
    this.showCompanies = true;
    this.adminService.getCompanies().subscribe(
      (data) => {
        if(!data) {
          this.message3 = "Neuspesno ucitavanje firmi!";
          return;
        }
        this.companies = data;
      })
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
  }

  closeModal() {
    this.selectedUser = null;
    this.errorMessage = '';
  }

  message: string;

  deactivateUser(user: User){
    this.adminService.deactivateUser(user).subscribe((response) => {
      if(response.message == "Korisnik deaktiviran"){
        this.message = "Korisnik deaktiviran";
        this.loadUsers('vlasnik');

      }
    })
  }

  activateUser(user: User){
    this.adminService.activateUser(user).subscribe((response) => {
      if(response.message == "Korisnik aktiviran"){
        this.message = "Korisnik aktiviran";
        this.loadUsers('vlasnik');
      }
    })
  }

  message2: string;

  approveUser(user: User) {
    this.adminService.activateUser(user).subscribe(response => {
      if (response.message == "Korisnik aktiviran") {
        this.message2 = 'Korisnik je uspešno odobren.';
        this.loadRegistrationRequests();
      }
    });
  }

  denyUser(user: User) {
    this.adminService.deactivateUser(user).subscribe(response => {
      if (response.message == "Korisnik deaktiviran") {
        this.message2 = 'Korisnik je uspešno odbijen.';
        this.loadRegistrationRequests();
      }
    });
  }



  username: string = this.selectedUser.username;
  password: string = this.selectedUser.password;
  name: string  = this.selectedUser.name;
  lastname: string = this.selectedUser.lastname;
  gender: string  = this.selectedUser.gender;
  address: string = this.selectedUser.address;
  number: string = this.selectedUser.number;
  email: string = this.selectedUser.email;
  creditCard: string = this.selectedUser.creditCard;
  picture: string = this.selectedUser.picture;

  errorMessage2: string;

  selectedFile: File = null;

  cardTypeIcon: string;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const img = new Image();
      img.src = window.URL.createObjectURL(file);

      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        window.URL.revokeObjectURL(img.src);

        if (width < 100 || height < 100 || width > 300 || height > 300) {
          this.errorMessage = 'Slika mora biti između 100x100 i 300x300 piksela.';
        } else if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
          this.errorMessage = 'Format slike mora biti JPG ili PNG.';
        } else {
          this.selectedFile = file;
          this.errorMessage = '';
        }
      };
    }
  }

  errorCard: string;

  onCreditCardInput() {
    const cardNumber = this.selectedUser.creditCard.replace(/\D/g, '');
    this.cardTypeIcon = '';
    this.errorCard = '';

    if (/^3(?:0[0-3]\d{12}|[68]\d{13})$/.test(cardNumber)) {
      this.cardTypeIcon = 'assets/diners.png';
    } else if (/^5[1-5]\d{14}$/.test(cardNumber)) {
      this.cardTypeIcon = 'assets/mastercard.png';
    } else if (/^4(?:53(?:2|9)|4556|4916|4929|4485|4716)\d{12}$/.test(cardNumber)) {
      this.cardTypeIcon = 'assets/visa.png';
    } else {
      this.errorCard = 'Broj kreditne kartice nije validan ili nije podržan.';
      return;
    }
    this.errorCard = '';
  }

  emailRegex(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  }

  phoneRegex(phone: string): boolean {
    const regex = /^\+?[0-9]{1,3}?[-. ]?\(?\d{2,4}\)?[-. ]?\d{3,4}[-. ]?\d{3,4}$/;
    return regex.test(phone);
  }

  updateUser() {

    if(!this.emailRegex(this.selectedUser.email)){
      this.errorMessage2 = 'Email nije validan';
      return;
    }

    if(!this.phoneRegex(this.selectedUser.number)){
      this.errorMessage2 = 'Broj telefona nije validan';
      return;
    }

    this.adminService.updateUser(this.selectedUser).subscribe((response) => {
      if (response.message == 'Azuriranje uspesno') {
        this.message = 'Azuriranje uspesno';
        this.errorMessage2 = '';
        this.errorMessage = '';
      } else {
        this.errorMessage2 = response.message;
      }
    });

  }

  profilePicture: string = null;

  getProfilePicture(picture: string, user: User){
    this.adminService.getProfilePicture(picture, user).subscribe((response) => {
      user.profilePicture = URL.createObjectURL(response);
    });
  }


  addDecorater(){
    this.router.navigate(['/dekorater-register']);
  }

  addCompany(){
    this.router.navigate(['/company-register']);
  }

}
