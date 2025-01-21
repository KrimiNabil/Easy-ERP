import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { EntityService } from 'src/app/services/entityService/entity.service';

import { UsersService } from 'src/app/services/userService/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  addForm!: FormGroup;
  entityForm !: FormGroup;
  user: any = {};
  connectedUser: any = {};
  entity: any = {};
  path: any = {}
  file: any = {}
  url: any = {}
  constructor(private router: Router, private userServ: UsersService, private formBuild: FormBuilder, private entityServ: EntityService) { }

  ngOnInit(): void {
    this.path = this.router.url
    this.addForm = this.formBuild.group({
      // User Details
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      gender: ['', [Validators.required]],
      pwd: ['', [Validators.required, Validators.minLength(6)]],
      confirmPwd: ['', [Validators.required]],
      // Billing Address
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      // Bank Details
      bankName: ['', Validators.required],
      branchName: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      swiftCode: ['', Validators.required]
    },
      {
        validator: this.passwordMatchValidator('pwd', 'confirmPwd') // Custom password match validator
      });
    this.entityForm = this.formBuild.group({
      name: [""],
      registrationNumber: [""],
      industry: [""],
      website: [""],
      email: [""],
      phone: [""],
      pwd: [""],
      confirmPwd: [""],
      address: ['', [Validators.required]], // Include the 'address' control
      city: [""],
      state: [""],
      country: [""],
      accountHolderName: [""],
      accountNumber: [""],
      bankName: [""],
      branchName: [""],
      swiftCode: [""],
    })

  }
  // Custom validator to check if passwords match
  passwordMatchValidator(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const pwdControl = formGroup.controls[password];
      const confirmPwdControl = formGroup.controls[confirmPassword];

      if (confirmPwdControl.errors && !confirmPwdControl.errors['mismatch']) {
        return;
      }

      if (pwdControl.value !== confirmPwdControl.value) {
        confirmPwdControl.setErrors({ mismatch: true });
      } else {
        confirmPwdControl.setErrors(null);
      }
    };
  }
  signup() {
    this.user = this.addForm.value;
    console.log(this.user);
    if (this.path === "/signup" || this.path === "/signup-admin") {
      if (this.path === "/signup-admin") {
        this.user.role = "Admin"
      } else {
        this.user.role = "Client"
      }
      this.userServ.signup(this.user, this.file).subscribe(
        (res) => {
          console.log(res);
          if (res.msg == "added") {
            this.router.navigate(['/Login'])
          } else {
            alert(res.msg)
          }
        }
      )
    } else if (this.path === "/add-accounting-agent") {
      let token = JSON.parse(sessionStorage.getItem("user") || "[]");
      if (token) {
        this.connectedUser = jwtDecode(token)
      }
      this.user.entityID = this.connectedUser.entityID
      this.userServ.addAgent(this.user, this.file).subscribe(
        (res) => {
          if (res.msg == "added and email was sent") {
            this.router.navigate(['/dashboard-entity'])
          } else {
            console.log("error");
          }
        }
      )
    } else {
      this.entity = this.entityForm.value
      console.log(this.entity)
      let token = JSON.parse(sessionStorage.getItem("user") || "[]");
      if (token) {
        this.connectedUser = jwtDecode(token)
      }
      this.entity.owner = this.connectedUser.id;
      this.entityServ.addEntity(this.entity, this.file).subscribe(
        (res) => {
          if (res.msg == "Entity and user updated successfully") {
            //logout use to change role
            sessionStorage.removeItem("user");
            this.connectedUser = null;
            this.router.navigate(['Login'])
          } else {
            alert(res.msg)
          }
        }
      )
    }
  }
  // Submit handler
  onSubmit(): void {
    console.log(this.addForm.value);
    
    if (this.addForm.valid) {
      console.log('Form Submitted', this.addForm.value);
    } else {
      this.addForm.markAllAsTouched(); // Highlight all invalid fields
    }
  }
  onImageSelected(event: Event) {
    // const file = (event.target as HTMLInputElement).files[0];
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      console.log(this.file);
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (_event) => {
        this.url = reader.result;
      }
    }
  }
}
