import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityService } from 'src/app/services/entityService/entity.service';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.css']
})
export class EditEntityComponent implements OnInit {
  editEntity!:FormGroup
  entity:any={
    address: {
      country: '',
      street: '',
      city: '',
      state: '',
    },
    bankDetails: {
      bankName: '',
      branchName: '',
      accountHolderName: '',
      accountNumber: '',
      swiftCode: '',
    },
  };
  constructor(private entServ:EntityService,private activeRout:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
let id=this.activeRout.snapshot.params['id'];
this.entServ.getEntityByID(id).subscribe(
  (doc)=>{
    if (doc) {
      this.entity=doc.entity,
      console.log(this.entity);
      
    } else {
      alert("Error");
    }
  }
)
  }
  edit(){
  this.entServ.updateEntity(this.entity).subscribe(
    (res)=>{
      if (res.msg=="update sucsses") {
        this.router.navigate(['entities-list'])
      } else {
        alert("error")
      }
    }
  )
  }
}
