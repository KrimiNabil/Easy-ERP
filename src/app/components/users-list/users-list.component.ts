import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/userService/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  
  userTab!: any[];

  constructor(private userServ: UsersService,private router:Router) { }

  ngOnInit(): void {
    this.userServ.getAllUsers().subscribe(
      (res) => {
        this.userTab = res.users;
        console.log(this.userTab);

      }
    )
  }
  display(id:any){
    this.router.navigate([`display-user/${id}`]);
  };
  edit(id:any){
    this.router.navigate([`edit-user/${id}`]);

  };
  delete(id:any){
    console.log(id);
    this.userServ.deletUserByID(id).subscribe(
      (res)=>{
        if (res.msg) {
         this.userServ.getAllUsers().subscribe(
          (res)=>{
            this.userTab=res.users
          }
         )
        }
      }
    )
  };


}
