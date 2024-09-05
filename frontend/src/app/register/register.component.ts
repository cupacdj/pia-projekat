import { Component, ElementRef, ViewChild } from '@angular/core';
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

  siteKey: string = '6LdoeDcqAAAAAESqnN4XnfM_54w6TafCevlN2pjt';
  captchaError: boolean = false;

  @ViewChild('captchaRef') captchaRef: ElementRef;

  ngOnInit(): void {
    (window as any).grecaptcha.ready(() => {
      console.log('reCAPTCHA je spremna');
    });
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

  emailRegex(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  }

  phoneRegex(phone: string): boolean {
    const regex = /^\+?[0-9]{1,3}?[-. ]?\(?\d{2,4}\)?[-. ]?\d{3,4}[-. ]?\d{3,4}$/;
    return regex.test(phone);
  }

  captchaToken: string = '';

  register() {
    (window as any).grecaptcha.execute(this.siteKey, { action: 'register' }).then((token: string) => {
      this.captchaToken = token;

      this.submitForm();
    }).catch((error: any) => {
      console.error('reCAPTCHA error:', error);
    });
  }


  submitForm() {

    if (!this.username || !this.password || !this.name || !this.lastname || !this.gender || !this.address || !this.number || !this.email || !this.creditCard) {
      this.errorMessage = 'Morate popuniti sva polja označena zvezdicom (osim slike).';
      return;
    }

    if (!this.emailRegex(this.email)) {
      this.errorMessage = 'Email nije u dobrom formatu!';
      return;
    }

    if (!this.phoneRegex(this.number)) {
      this.errorMessage = 'Broj telefona nije u dobrom formatu!';
      return;
    }

    if (!this.validatePassword(this.password)) {
      this.errorMessage = 'Lozinka nije u dobrom formatu!';
      return;
    }

    //const captchaResponse = (window as any).grecaptcha.getResponse();

    // if (!captchaResponse) {
    //   this.captchaError = true;
    //   return;
    // }

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
    formData.append('type', 'vlasnik');
    formData.append('company', '');
    formData.append('captchaToken', this.captchaToken);

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile, this.selectedFile.name);
    }

    this.userServis.registerUser(formData).subscribe((response) => {
      if (response.message == 'Zahtev za registraciju je uspešno odrađen, čeka se odobrenje administratora!') {
        this.ruter.navigate(['/login']);
      } else {
        this.errorMessage = response.message;
      }
    });

  }


}
