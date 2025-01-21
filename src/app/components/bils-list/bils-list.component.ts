import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BillService } from 'src/app/services/billService/bill.service';

@Component({
  selector: 'app-bils-list',
  templateUrl: './bils-list.component.html',
  styleUrls: ['./bils-list.component.css']
})
export class BilsListComponent implements OnInit {
  billForm!: FormGroup;
  bills: any = []
  constructor(private router: Router, private billServ: BillService) { }

  ngOnInit(): void {
    this.billServ.getAllBills().subscribe(
      (res) => {
        this.bills = res.bills
        console.log(this.bills);

      }
    )
  }
  display(id: any) {
this.billServ.getPDF(id).subscribe(
  (res)=>{
    console.log(res);
    
  }
)
  };
  edit(id: any) {
    this.router.navigate([`edit-payables/bills/${id}`])
  };
  delete(id: any) {
    this.billServ.deleteBillByID(id).subscribe(
      (res) => {
        if (res.msg) {
          console.log(res.msg);

          this.billServ.getAllBills().subscribe(
            (res) => {
              this.bills = res.bills
            }
          )
        } else {
          console.log("error");

        }
      }
    )
  }

}
