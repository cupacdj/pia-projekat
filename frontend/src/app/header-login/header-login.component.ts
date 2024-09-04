import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-login',
  templateUrl: './header-login.component.html',
  styleUrls: ['./header-login.component.css']
})
export class HeaderLoginComponent {


  constructor(private router: Router) {}

  logoff() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
