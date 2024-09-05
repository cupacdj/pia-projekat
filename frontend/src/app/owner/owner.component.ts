import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  user: User = { username: '', password: '', name: '', lastname: '', address: '', number: '', email: '', creditCard: '', picture: '', gender: '', profilePicture: '', type: '', status: '', company: '', scheduler: [], canTakeJob: '' };


  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    if (!localStorage.getItem('ulogovan')) {
      alert('Niste ulogovani!');
      this.router.navigate(['/login']);
    }
    this.userService.getUser(localStorage.getItem('ulogovan')).subscribe(
      (response: { user: User }) => {
        this.user = response.user;
        localStorage.setItem('tip', this.user.type);
        this.router.navigate(['/owner-profile']);
      }
    );

  }

}
