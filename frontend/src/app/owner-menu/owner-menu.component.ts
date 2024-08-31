import { Component } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/user';

@Component({
  selector: 'app-owner-menu',
  templateUrl: './owner-menu.component.html',
  styleUrls: ['./owner-menu.component.css']
})
export class OwnerMenuComponent {

  constructor(private router: Router) {}

  user: User = { username: '', password: '', name: '', lastname: '', address: '', number: '', email: '', creditCard: '', picture: '', gender: '', profilePicture: '', type: '', status: '', company: '', scheduler: [] };

  ngOnInit(): void {
    if (!localStorage.getItem('ulogovan')) {
      alert('Niste ulogovani!');
      this.router.navigate(['/login']);
    }
  }

  ownerProfile(){
    this.router.navigate(['/owner-profile']);
  }

  companies(){
    this.router.navigate(['/owner-company']);
  }

  schedulingJobs(){
    this.router.navigate(['/owner-scheduling']);
  }

}
