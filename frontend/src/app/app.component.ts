import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  userRole: string;

  ngOnInit() {
    if((localStorage.getItem('ulogovan') != null) || (localStorage.getItem('admin') != null)){
      this.userRole = 'user';
    }
    else{
      this.userRole = 'guest';
    }
  }

}
