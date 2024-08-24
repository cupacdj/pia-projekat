import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import User from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

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
      this.error = "";
      this.userService.login(this.username, this.password).subscribe((response: {message: string, user: User}) => {
        if (response.user == null) {
          console.log(response.message);
          this.error = response.message;
        }
        else {
          if (response.user.type == "vlasnik") {
            localStorage.setItem("ulogovan", response.user.username);
            this.router.navigate(["/vlasnik"]);
          }
          else if (response.user.type == "dekorater") {
            localStorage.setItem("ulogovan", response.user.username);
            this.router.navigate(["/dekorater"]);
          }
        }
      })
    }
  }
}


