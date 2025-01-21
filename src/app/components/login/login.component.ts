import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UsersService } from 'src/app/services/userService/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  user: any = {}
  submitted = false;
  errorMessage = "";
  decoded: any = {}
  constructor(private userServ: UsersService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  login() {
    this.user = this.loginForm.value;
    this.userServ.login(this.user).subscribe(
      (res) => {
        console.log(res.token);
        if (res.token) {
          this.decoded = jwtDecode(res.token)
          console.log(this.decoded);
          // save the token in sessionStorge to use later
          sessionStorage.setItem("user", JSON.stringify(res.token));
          if (this.decoded.role == "Admin") {
            this.router.navigate(['dashboard-admin'])
          } else if (this.decoded.role == "Entity Owner" || this.decoded.role == "Accounting Agent") {
            this.router.navigate(['dashboard-entity'])
          } else {
            this.router.navigate(['dashboard'])
          }
        } else {
          this.errorMessage = "Please Check Your Email And Password"
        }

      }

    )



  }
}
