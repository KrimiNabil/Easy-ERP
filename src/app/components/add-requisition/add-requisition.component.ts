import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { RequisitionServiceService } from 'src/app/services/requisitionService/requisition-service.service';
import { UsersService } from 'src/app/services/userService/users.service';

@Component({
  selector: 'app-add-requisition',
  templateUrl: './add-requisition.component.html',
  styleUrls: ['./add-requisition.component.css']
})
export class AddRequisitionComponent implements OnInit {
  puchaseRequsitionForm!: FormGroup;
  products: any = [];
  requisition: any = {};
  conectedUser:any={};
  loading:boolean=false;
  showModal: boolean = false;
  constructor(private formBuild: FormBuilder, private pRequisition: RequisitionServiceService,private router:Router, private userServ:UsersService) {
    this.puchaseRequsitionForm = this.formBuild.group({
      requisitionID: [""],
      requestDate: [""],
      dueDate: [""],
      requesterName: [""],
      justification: [""],
      approvedBy: [""],
    })
  }

  ngOnInit(): void {
    let token = JSON.stringify(sessionStorage.getItem("user"))
    this.conectedUser = jwtDecode(token)
  }
  addItem() {
    this.products.push({});
  }
  removeItem(index: number) {

    this.products.splice(index, 1);
  }
  addRequisition() {
    this.loading = true
    this.requisition = { ...this.puchaseRequsitionForm.value, products: this.products }
    this.requisition.userID = this.conectedUser.id
    console.log(this.requisition);
    this.pRequisition.addRequisition(this.requisition).subscribe(
      (res) => {
        if (res.path) {
          setTimeout(() => {
            this.loading = false; // Stop the loading spinner
            this.showModal = true; // Show success modal
            // Automatically close the modal after 3 seconds
            setTimeout(() => {
              this.showModal = false;
            }, 3000);
          }); // Simulated delay (replace with actual API response)
        
         this.router.navigate(['requisitions-list'])
        }

      }
    )
  }
}
