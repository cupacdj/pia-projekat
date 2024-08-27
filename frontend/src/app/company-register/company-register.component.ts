import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-company-register',
  templateUrl: './company-register.component.html',
  styleUrls: ['./company-register.component.css']
})
export class CompanyRegisterComponent {

  constructor(private router: Router, private userService: UserService ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('admin')) {
      alert('Niste autorizovani kao administrator!');
      this.router.navigate(['/login/admin']);
    }
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
  company: string;

  back(){
    this.router.navigate(['/admin']);
  }

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
          this.picture = window.URL.createObjectURL(file);
          this.errorMessage = '';
        }
      };
    }
  }

  onCreditCardInput() {
    const cardNumber = this.creditCard.replace(/\D/g, '');
    this.cardTypeIcon = '';

    if (/^3(?:0[0-3]\d{12}|[68]\d{13})$/.test(cardNumber)) {
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

  message: string;

  addDecorator() {

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
    formData.append('type', 'dekorater');
    formData.append('company', this.company);

    // Dodavanje fajla ako je odabran
    if (this.selectedFile) {
      formData.append('picture', this.selectedFile, this.selectedFile.name);
    }

    this.userService.registerUser(formData).subscribe((response) => {
      if (response.message == 'Zahtev za registraciju je uspešno odrađen, čeka se odobrenje administratora!') {
        this.message = response.message;
      } else {
        this.errorMessage = response.message;
      }
    });

  }

}
