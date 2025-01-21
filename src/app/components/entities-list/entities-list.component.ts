import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EntityService } from 'src/app/services/entityService/entity.service';

@Component({
  selector: 'app-entities-list',
  templateUrl: './entities-list.component.html',
  styleUrls: ['./entities-list.component.css']
})
export class EntitiesListComponent implements OnInit {
entities:any=[]
entity:any={};
  constructor(private entServ:EntityService,private route:Router) { }

  ngOnInit(): void {
    this.entServ.getAllEntities().subscribe(
      (docs)=>{
        if (docs) {
          this.entities=docs.entities
          console.log(this.entities);
          
        }
      }
    )
  }
display(id:any){
  this.route.navigate([`entity-details/${id}`])
};
edit(id:any){
  this.route.navigate([`edit-entity/${id}`])
};
delete(id:any){
  this.entServ.deleteEntity(id).subscribe(
    (res)=>{
      if (res.msg=="deleted") {
        this.entServ.getAllEntities().subscribe(
          (docs)=>{
            this.entities=docs.entities
          }
        )
      }
    }
  )
}
}
