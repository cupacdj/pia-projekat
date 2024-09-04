import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dekorater-menu',
  templateUrl: './dekorater-menu.component.html',
  styleUrls: ['./dekorater-menu.component.css']
})
export class DekoraterMenuComponent {

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('ulogovan')) {
      alert('Niste ulogovani!');
      this.router.navigate(['/login']);
    }
  }

  dekoraterProfile(){
    this.router.navigate(['/dekorater-profile']);
  }

  dekoraterScheduling(){
    this.router.navigate(['/dekorater-scheduling']);
  }

  dekoraterMaintenance(){
    this.router.navigate(['/dekorater-maintenance']);
  }

  statistics(){
    this.router.navigate(['/statistics']);
  }
}
