import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import User from '../models/user';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  constructor(private router: Router, private userService: UserService) { }

  username: string;
  password: string;
  error: string;

  login() {
    if (this.username == "" || this.password == "") {
      this.error = "Niste uneli sve podatke!";
      return;
    }

    else {
      this.userService.login(this.username, this.password).subscribe((response: {message: string, user: User}) => {
        if (response.user && response.user.type == 'admin') {
          if (response.message == 'Login uspešan') {
            localStorage.setItem("ulogovan", response.user.username);
            this.router.navigate(['/admin']);
          } else {
            this.error = response.message;
          }
        } else {
          this.error = 'Niste autorizovani kao administrator.';
        }
      });
    }
  }
}
