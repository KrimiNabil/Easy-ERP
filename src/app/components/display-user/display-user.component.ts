import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/userService/users.service';

@Component({
  selector: 'app-display-user',
  templateUrl: './display-user.component.html',
  styleUrls: ['./display-user.component.css']
})
export class DisplayUserComponent implements OnInit {
  userFor!: FormGroup;
  user: any = {}
  constructor(private userServ: UsersService, private activeRout: ActivatedRoute) { }

  ngOnInit(): void {
    let id = this.activeRout.snapshot.params[('id')];
    this.userServ.getUserByID(id).subscribe(
      (res) => {
        this.user = res.user;
        console.log(this.user);

      }
    )
  }

}
