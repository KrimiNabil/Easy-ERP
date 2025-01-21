import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { PurchaseService } from 'src/app/services/purchaseService/purchase.service';
import { RequisitionServiceService } from 'src/app/services/requisitionService/requisition-service.service';

@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.css']
})
export class AddPurchaseOrderComponent implements OnInit {
  puchaseOrderForm!: FormGroup;
  products: any = [];
  conectedUser: any = {};
  requisitions: any = []
  puchaseOrder: any = {};
  file:any={};
  constructor(
    private formBuilder: FormBuilder,
    private poService: PurchaseService,
    private router: Router,
    private reqServ: RequisitionServiceService
  ) { }

  ngOnInit(): void {
    this.puchaseOrderForm = this.formBuilder.group({
      purchaseOrderID: [""],
      date: [""],
      aprdate: [""],
      amount: [""],
      discount: [""],
      adjustments: [""],
      discountTerms: [""],
      approvedBy: [""],
      reference: [""],

    })
    let token = JSON.stringify(sessionStorage.getItem("user") || "[]")
    this.conectedUser = jwtDecode(token)
    console.log(this.conectedUser);
    this.reqServ.getRequisitions().subscribe(
      (docs) => {
        this.requisitions = docs.requisitions

      }
    )
  }
  addPO() {
    this.puchaseOrder = { ...this.puchaseOrderForm.value, products: this.products };
    this.puchaseOrder.userID = this.conectedUser.id
    console.log(this.puchaseOrder);
    this.poService.addPurchasOrder(this.puchaseOrder,this.file).subscribe(
      (res) => {
        console.log(res);
        if (res.path) {
          this.router.navigate(['purchase-orders-list'])
        }
      }
    )
  }
  addItem() {
    this.products.push({});
  }
  removeItem(index: number) {

    this.products.splice(index, 1);
  }
  updateTTC(product: any) {
    const total = product.quentity * product.priceHT;
    const tvaAmount = (product.priceTVA / 100) * total;
    product.priceTTC = total + tvaAmount;
  }
  calcSum(tab: any) {
    // let sum = 0
    // for (let i = 0; i < tab.length; i++) {
    //   sum = sum + this.calaculTTC(tab[i].quantity, tab[i].priceHT, tab[i].priceTVA)
    // }
    // return sum
    return tab.reduce((sum: number, elt: any) => sum + elt.priceTTC, 0);
  }
  calcAmount(tab: any, dis: any) {
    let amount = this.calcSum(tab) - dis;
    this.puchaseOrderForm.value.amount = amount;
    return amount
  }

  onImageSelected(event: Event) {
    // const file = (event.target as HTMLInputElement).files[0];
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      console.log(this.file);
    }
  }
}
