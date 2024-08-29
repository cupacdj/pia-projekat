import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/user';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  user: User = { username: '', password: '', name: '', lastname: '', address: '', number: '', email: '', creditCard: '', picture: '', gender: '', profilePicture: '', type: '', status: '', company: '', scheduler: [] };


  constructor(private router: Router) { }

  ngOnInit(){
    if (!localStorage.getItem('ulogovan')) {
      alert('Niste ulogovani!');
      this.router.navigate(['/login']);
    }
    this.router.navigate(['/owner-profile']);
  }

}
