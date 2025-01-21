import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BillService } from 'src/app/services/billService/bill.service';
import { InvoiceService } from 'src/app/services/invoiceService/invoice.service';
import { PurchaseService } from 'src/app/services/purchaseService/purchase.service';
import { RequisitionServiceService } from 'src/app/services/requisitionService/requisition-service.service';

@Component({
  selector: 'app-edit-payables',
  templateUrl: './edit-payables.component.html',
  styleUrls: ['./edit-payables.component.css']
})
export class EditPayablesComponent implements OnInit {
  updateForm!: FormGroup
  payables: any = {};
  products: any = [];
  refecences: any = [];
 
  constructor(private router: Router,
    private pRequisistion: RequisitionServiceService,
    private pOrders: PurchaseService,
    private invoiceServ: InvoiceService,
    private billServ: BillService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let path = this.router.url
    let id = this.activeRoute.snapshot.params['id']
    console.log(id);
    if (path.includes("POs")) {
      this.pOrders.getPurchasOrderByID(id).subscribe(
        (res) => {
          this.payables = res.purchase
          
          this.products=this.payables.products
          console.log(this.products);
          
        }
      )
      // this.pRequisistion.deleteRequisitionById(id).subscribe()
    } else if (path.includes("bill")) {
      this.billServ.getBillByID(id).subscribe(
        (res) => {
          this.payables = res.bill
          console.log(this.payables);
          this.products=this.payables.paymentSum
        }
      )
    } else if (path.includes("invoice")) {
      this.invoiceServ.getInvoiceByID(id).subscribe(
        (res) => {
          this.payables = res.invoice
          console.log(this.payables);
          
          this.products=this.payables.products
        }
      )
    } else {
      this.pRequisistion.getRequisitionById(id).subscribe(
        (res) => {
          this.payables=res.requisition
          this.products=this.payables.products
          console.log(this.payables);
        }
      )
    }
  }
  updateTTC(product: any) {
    const total = product.quentity * product.priceHT;
    const tvaAmount = (product.priceTVA / 100) * total;
    product.priceTTC = total + tvaAmount;
  }
  calcSum(tab: any) {
    return tab.reduce((sum: number, elt: any) => sum + elt.priceTTC, 0);
  }
  calcAmount(tab: any, dis: any) {
    let amount = this.calcSum(tab) - dis;
    this.payables.amount = amount;
    return amount
  }
  update() {
    console.log(this.payables);
    if (this.payables.documentName =='Purchase Order') {
      this.payables.products=this.products
      this.pOrders.updatePurchasOrder(this.payables).subscribe(
        (res) => {
        if (res.msg=="updated") {
            this.router.navigate(['purchase-orders-list']);
        } 
        }
      )
      // this.pRequisistion.deleteRequisitionById(id).subscribe()
    } else if (this.payables.documentName ==='Bill') {
      this.billServ.updateBill(this.payables).subscribe(
        (res) => {
         if (res.msg=="updated") {
          this.router.navigate(['bills-list']);
         }
        }
      )
    } else if (this.payables.documentName ==='Invoice') {
      this.invoiceServ.updateInvoice(this.payables).subscribe(
        (res) => {
         if (res.pdf) {
          this.router.navigate(['invoices-list']);
         }
        }
      )
    } else {
      this.pRequisistion.upDate(this.payables).subscribe(
        (res) => {
          if (res.msg) {
            this.router.navigate(['requisitions-list'])
          }
        }
      )
    }
    
   }
  addItem() {
    this.products.push({})
  }
  removeItem(index: number) {
    console.log(index);
  }
 
}
