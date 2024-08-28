import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-company',
  templateUrl: './owner-company.component.html',
  styleUrls: ['./owner-company.component.css']
})
export class OwnerCompanyComponent {

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('ulogovan')) {
      alert('Niste ulogovani!');
      this.router.navigate(['/login']);
    }
  }

}
