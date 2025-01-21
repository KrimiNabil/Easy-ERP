import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-left-sidebr',
  templateUrl: './left-sidebr.component.html',
  styleUrls: ['./left-sidebr.component.css']
})
export class LeftSidebrComponent implements OnInit {
  connectedUser:any={}
  constructor(private router:Router) { }

  ngOnInit(): void {
   
  }
  connect(): boolean {
    const path = this.router.url;
    return path !== '/' &&path !== '/signup-admin' && path !== '/signup' && path !== '/Login';
  }
  isLogedIn(){
    let token = sessionStorage.getItem("user") ;
    if (token) {
      this.connectedUser=jwtDecode(token)
      // console.log(this.connectedUser);
      
    
      
    }
    // convert to bolean
    return !!token
  }
  logout(){
    sessionStorage.removeItem("user");
     this.connectedUser = null;
    this.router.navigate(['/Login']);
  }

}
