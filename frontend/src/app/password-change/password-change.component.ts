import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent {

  constructor(private userService: UserService, private router: Router) {}

  username: string;
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
  errorMessage: string;

  validatePassword(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[\W_]).{6,10}$/;
    return regex.test(password);
  }

  goBack() {
    let tip = localStorage.getItem('tip');
    console.log(tip);
    if (tip == 'admin') {
      this.router.navigate(['/admin']);
    } else if (tip == 'dekorater') {
      this.router.navigate(['/dekorater']);
    } else if (tip == 'vlasnik') {
      this.router.navigate(['/vlasnik']);
    }


  }

  changePassword() {
    if (!this.oldPassword || !this.newPassword || !this.repeatNewPassword) {
      this.errorMessage = 'Morate popuniti sva polja!';
      return;
    }

    if (this.newPassword !== this.repeatNewPassword) {
      this.errorMessage = 'Nove lozinke se ne poklapaju!';
      return;
    }

    if (!this.validatePassword(this.newPassword)) {
      this.errorMessage = 'Nova lozinka nije u dobrom formatu!';
      return;
    }

    this.username = localStorage.getItem('ulogovan');

    if (!this.username) {
      this.errorMessage = 'Niste ulogovani!';
      return;
    }

    this.userService.changePassword(this.username, this.oldPassword, this.newPassword).subscribe(
      (response: { message: string }) => {
        if (response.message == 'Lozinka uspešno promenjena') {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = response.message;
        }
      }
    );
  }

}
