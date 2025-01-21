import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityService } from 'src/app/services/entityService/entity.service';

@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.css']
})
export class EntityDetailsComponent implements OnInit {
entity:any={};
  constructor(private activeRoute:ActivatedRoute,private entityServ:EntityService) { }

  ngOnInit(): void {
    let id =this.activeRoute.snapshot.params['id'];
    this.entityServ.getEntityByID(id).subscribe(
      (doc)=>{
        if(doc){
this.entity=doc.entity
        }
      }
    )
  }

}
