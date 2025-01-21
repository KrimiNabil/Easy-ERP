import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'easy-ERP';
  isLoggedIn(): boolean {
    
    return !!sessionStorage.getItem('user'); 
  }
}
