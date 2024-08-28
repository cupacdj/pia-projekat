import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-menu',
  templateUrl: './owner-menu.component.html',
  styleUrls: ['./owner-menu.component.css']
})
export class OwnerMenuComponent {

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('ulogovan')) {
      alert('Niste ulogovani!');
      this.router.navigate(['/login']);
    }
  }

  ownerProfile(){
    this.router.navigate(['/vlasnik/profile']);
  }

  companies(){
    this.router.navigate(['/owner-company']);
  }

}
