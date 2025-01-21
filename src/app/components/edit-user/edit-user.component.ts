import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/userService/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
updateForm!:FormGroup;
user:any=[]
  constructor(private userServ:UsersService, private activeRout:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
let id= this.activeRout.snapshot.params['id'];
    this.userServ.getUserByID(id).subscribe(
      (res)=>{
        this.user=res.user;
        console.log(this.user);
      }
    )
  }
update(){
  console.log(this.user);
  this.userServ.updateUser(this.user).subscribe(
  (res)=>{
    if (res.msg) {
      this.router.navigate(['users-list'])
    } else {
      
    }
    
  }
)
}
}
