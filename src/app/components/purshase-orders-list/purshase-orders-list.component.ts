import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseService } from 'src/app/services/purchaseService/purchase.service';
import { UsersService } from 'src/app/services/userService/users.service';

@Component({
  selector: 'app-purshase-orders-list',
  templateUrl: './purshase-orders-list.component.html',
  styleUrls: ['./purshase-orders-list.component.css']
})
export class PurshaseOrdersListComponent implements OnInit {
  purchaseOrders: any = []
  user: any = {}
  constructor(private poServ: PurchaseService,
    private userServ: UsersService,
    private router: Router) { }

  ngOnInit(): void {
    this.poServ.getAllPurchasOrder().subscribe(
      (res) => {
        this.purchaseOrders = res.purchases
        console.log(this.purchaseOrders);
      }
    )
  }
  getUser(id: any) {
    // this.userServ.getUserByID(id).subscribe(
    //   (res)=>{
    //    this.user= res.user
    //   }
    // )
    // return (`${this.user.userName} (${this.user.role})`)
  }
  display(id: any) { };
  edit(id: any) {
    this.router.navigate([`edit-payables/POs/${id}`])
  };
  delete(id: any) {
    this.poServ.deletePurchasOrderByID(id).subscribe(
      (res) => {
        if (res.msg == "deleted") {
          this.poServ.getAllPurchasOrder().subscribe(
            (res) => {
              this.purchaseOrders = res.purchases
            }
          )
        }
      }
    )
  };
}
