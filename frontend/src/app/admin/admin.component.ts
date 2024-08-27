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

  usersReq: User[] = [];

  showUserList() {
    this.showUsers = true;
    this.showRegReq = false;
    this.loadUsers('vlasnik');
  }

  showRegistrationRequests() {
    this.showUsers = false;
    this.showRegReq = true;
    this.loadRegistrationRequests();
    this.message2 = '';
  }

  loadUsers(type: string) {
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

  loadCompanies(){
    this.adminService.getCompanies().subscribe(
      (data) => {
        if(!data) {
          this.errorMessage = "Neuspesno ucitavanje firmi!";
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

  updateUser() {

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
    console.log(picture);
    this.adminService.getProfilePicture(picture, user).subscribe((response) => {
      user.profilePicture = URL.createObjectURL(response);
    });
  }


  addDecorater(){
    this.router.navigate(['/dekorater-register']);
  }

}
