import { Component } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dekorater-profile',
  templateUrl: './dekorater-profile.component.html',
  styleUrls: ['./dekorater-profile.component.css']
})
export class DekoraterProfileComponent {

  constructor(private router: Router, private userService: UserService ) { }

  user: User = { username: '', password: '', name: '', lastname: '', address: '', number: '', email: '', creditCard: '', picture: '', gender: '', profilePicture: '', type: '', status: '', company: '',scheduler: [] };

  usernameFind: string;
  messageGet: string;
  profilePicture: string;

  ngOnInit(): void {

    if (!localStorage.getItem('ulogovan')) {
      alert('Niste ulogovani!');
      this.router.navigate(['/login']);
    }

    this.usernameFind = localStorage.getItem('ulogovan');

    this.userService.getUser(this.usernameFind).subscribe((response) => {
      if(response.message == 'Korisnik pronadjen') {
        this.user = response.user;
          this.userService.getProfilePicture(this.user.picture, this.user).subscribe((response) => {
            this.user.profilePicture = URL.createObjectURL(response);
            this.profilePicture = this.user.profilePicture;
          });
      }else{
        this.messageGet = response.message;
      }
    });
  }

  errorMessage: string;

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
          this.profilePicture = URL.createObjectURL(this.selectedFile);
          this.errorMessage = '';
        }
      };
    }
  }

  errorCard: string;

  onCreditCardInput() {
    const cardNumber = this.user.creditCard.replace(/\D/g, '');
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

  message: string;

  errorMessage2: string;

  updateUser() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('picture', this.selectedFile, this.selectedFile.name);
      formData.append('username', this.user.username);
      formData.append('password', this.user.password);
      formData.append('name', this.user.name);
      formData.append('lastname', this.user.lastname);
      formData.append('gender', this.user.gender);
      formData.append('address', this.user.address);
      formData.append('number', this.user.number);
      formData.append('email', this.user.email);
      formData.append('creditCard', this.user.creditCard);
      formData.append('company', this.user.company);
      formData.append('type', this.user.type);

      this.userService.updateUserPicture(formData).subscribe((response) => {
        if (response.message == 'Korisnik je uspesno azuriran') {
          this.message = 'Azuriranje uspesno';
          this.errorMessage = '';
        } else {
          this.errorMessage2 = response.message;
        }
      });
    } else {
      this.userService.updateUser(this.user).subscribe((response) => {
        if (response.message == 'Korisnik je uspesno azuriran') {
          this.message = 'Azuriranje uspesno';
          this.errorMessage = '';
        } else {
          this.errorMessage2 = response.message;
        }
      });
    }
  }

}
