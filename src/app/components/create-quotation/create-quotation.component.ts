import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { InventoryService } from 'src/app/services/inventoryService/inventory.service';
import { QuotationService } from 'src/app/services/priceService/quotation.service';

@Component({
  selector: 'app-create-quotation',
  templateUrl: './create-quotation.component.html',
  styleUrls: ['./create-quotation.component.css']
})
export class CreateQuotationComponent implements OnInit {
  priceQuotation!: FormGroup
  products: any = [];
  items:any=[];
  quotation: any = {}
  conectedUser: any = {}
  loading: boolean = false;
  selectedItemId: string | null = null;

  constructor(private formbuild: FormBuilder, private priceServ: QuotationService, private router:Router , private invServ:InventoryService) {
    this.priceQuotation = this.formbuild.group({
      quotationNumber: [""],
      customerEmail:[''],
      approvedBy: [""],
      discount: [""],
      name: [''],
      email: [''],
    })
  }

  ngOnInit(): void {
    // Log the updated products array for debugging
    console.log('Updated Products:', this.products);
    let token = JSON.stringify(sessionStorage.getItem("user"))
    this.conectedUser = jwtDecode(token)
    this.invServ.getAllInventory().subscribe(
      (prods)=>{
        if(prods.inventory){
          this.items=prods.inventory;
          console.log(this.items);
        }
      }
    )
  }

  addProductToTable(event: Event) {
    this.selectedItemId = (event.target as HTMLSelectElement).value;
    console.log('Selected Product ID:', this.selectedItemId);
  
    if (this.selectedItemId) {
      this.invServ.getInventoryItemByID(this.selectedItemId).subscribe((doc) => {
        if (doc.item) {
          let item = doc.item;
          console.log(item);
  
          // Create a completely new object for the product
          const newProduct = {
            itemID:this.selectedItemId,
            productName: item.productName,
            quantity: 0, // Default quantity
            priceHT: item.sellsPricePerUnit, // Default H.T.
            priceTVA: 0, // Default VAT
            priceTTC: 0, // Default total price
          };
  
          // Add the new product to the array without reusing references
          this.products = [...this.products, { ...newProduct }];
          console.log('Products Array:', this.products);
        }
      });
    }
  }
  

  // addProductToTable(event: Event) {
  //   this.selectedItemId = (event.target as HTMLSelectElement).value;
  //   console.log('Selected Product ID:', this.selectedItemId);
  //   if (this.selectedItemId) {
  //     this.invServ.getInventoryItemByID(this.selectedItemId).subscribe((doc) => {
  //       if (doc.item) {
  //         let item = doc.item;
  //         console.log(item);
  //         // Create a new object to avoid shared references
  //          // Create a new object for the product
  //     const newProduct = {
  //       productName: item.productName,
  //       quantity: 0, // Default quantity
  //       priceHT: item.sellsPricePerUnit, // Default H.T.
  //       priceTVA: 0, // Default VAT
  //       priceTTC: 0, // Default total price
  //     };

  //     // Add the new product to the table without using push
  //     this.products = [...this.products, newProduct];

  //         // this.products.push({
  //         //   productName: item.productName,
  //         //   quantity: 0, // Default quantity
  //         //   priceHT: item.sellsPricePerUnit, // Default H.T.
  //         //   priceTVA: 0, // Default VAT
  //         //   priceTTC: 0, // Default total price
  //         // }) 
  //         // Use push to directly add to the array
  //         // this.products.push({newProduct});
  //         // Log the updated products array for debugging
  //         console.log('Updated Products:', this.products);
  //       }
  //     });
  //   }
  // }
  
  addQuotation() {
    this.loading=true
    this.quotation = { ...this.priceQuotation.value, products: this.products }
    this.quotation.userId = this.conectedUser.id;
    console.log(this.quotation);
    this.priceServ.addQuotation(this.quotation).subscribe(
      (res) => {
        this.loading=false
        if (res.path) {
          this.router.navigate(['quotations-list'])
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
    const total = product.quantity * product.priceHT;
    const tvaAmount = (product.priceTVA / 100) * total;
    product.priceTTC = total + tvaAmount;
  }
  calcSum(tab: any) {
    let subtotal = tab.reduce((sum: number, elt: any) => sum + elt.priceTTC, 0);
    this.priceQuotation.value.subtotal = subtotal
    return subtotal
  }
  calcAmount(tab: any, dis: any) {
    let amount = this.calcSum(tab) - dis;
    this.priceQuotation.value.amount = amount;
    return amount
  }
}
