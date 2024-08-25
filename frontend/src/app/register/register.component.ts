import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private userServis: UserService,
    private ruter: Router) { }

  ngOnInit(): void {
  }

  username: string;
  password: string;
  name: string;
  lastname: string;
  gender: string;
  address: string;
  number: string;
  email: string;
  creditCard: string;
  picture: string;

  errorMessage: string;

  selectedFile: File = null;

  cardTypeIcon: string;

  validatePassword(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[\W_]).{6,10}$/;
    return regex.test(password);
  }

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

  onCreditCardInput() {
    const cardNumber = this.creditCard.replace(/\D/g, '');
    this.cardTypeIcon = '';

    if (/^3(?:00[0-3]\d{11}|[68]\d{13})$/.test(cardNumber)) {
      this.cardTypeIcon = 'assets/diners.png';
    } else if (/^5[1-5]\d{14}$/.test(cardNumber)) {
      this.cardTypeIcon = 'assets/mastercard.png';
    } else if (/^4(?:53(?:2|9)|4556|4916|4929|4485|4716)\d{12}$/.test(cardNumber)) {
      this.cardTypeIcon = 'assets/visa.png';
    } else {
      this.errorMessage = 'Broj kreditne kartice nije validan ili nije podržan.';
      return;
    }
    this.errorMessage = '';
  }

  register() {

    if (!this.username || !this.password || !this.name || !this.lastname || !this.gender || !this.address || !this.number || !this.email || !this.creditCard) {
      this.errorMessage = 'Morate popuniti sva polja označena zvezdicom (osim slike).';
      return;
    }

    if (!this.validatePassword(this.password)) {
      this.errorMessage = 'Lozinka nije u dobrom formatu!';
      return;
    }

    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('password', this.password);
    formData.append('name', this.name);
    formData.append('lastname', this.lastname);
    formData.append('gender', this.gender);
    formData.append('address', this.address);
    formData.append('number', this.number);
    formData.append('email', this.email);
    formData.append('creditCard', this.creditCard);

    // Dodavanje fajla ako je odabran
    if (this.selectedFile) {
      formData.append('picture', this.selectedFile, this.selectedFile.name);
    }

    this.userServis.registerUser(formData).subscribe((response) => {
      if (response.message == 'Zahtev za registraciju je uspesno odradjen ceka se odobrenje administratora!') {
        this.ruter.navigate(['/login']);
      } else {
        this.errorMessage = response.message;
      }
    });

  }


}
