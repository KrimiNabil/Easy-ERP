import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequisitionServiceService } from 'src/app/services/requisitionService/requisition-service.service';

@Component({
  selector: 'app-reqisitions-list',
  templateUrl: './reqisitions-list.component.html',
  styleUrls: ['./reqisitions-list.component.css']
})
export class ReqisitionsListComponent implements OnInit {
  requisitions: any = []
  constructor(private requisitionServ: RequisitionServiceService,private router:Router) { }

  ngOnInit(): void {
    this.requisitionServ.getRequisitions().subscribe(
      (res) => {
        this.requisitions = res.requisitions;
        
      }
    )

  }
   openPDF =(pdfUrl:any) => {
    // Open the PDF in a new browser tab
    window.open(pdfUrl, '_blank');
};
  display(id:any) {
    
   }
  edit(id:any) {
    this.router.navigate([`edit-payables/PRs/${id}`])
   }
  delete(id:any) {
    this.requisitionServ.deleteRequisitionById(id).subscribe(
      (res)=>{
        if (res.msg) {
          this.requisitionServ.getRequisitions().subscribe(
            (docs)=>{
              if (docs) {
                this.requisitions=docs.requisitions
              }
         
            }
          )
        }
      }
    )
   }
}
