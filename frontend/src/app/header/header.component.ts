import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router) { }

  flag: boolean = false;
  tip: string = '';


  ngOnInit(): void {
    if(localStorage.getItem('ulogovan') != null)
      this.flag = true;
    this.tip = localStorage.getItem('tip');
  }

  profile(){
    if(this.tip == 'admin')
      this.router.navigate(['/admin']);
    else if(this.tip == 'dekorater')
      this.router.navigate(['/dekorater']);
    else if(this.tip == 'vlasnik')
      this.router.navigate(['/vlasnik']);
  }

}
