import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { InvoiceService } from 'src/app/services/invoiceService/invoice.service';
import { PurchaseService } from 'src/app/services/purchaseService/purchase.service';
import { UsersService } from 'src/app/services/userService/users.service';



@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css']
})
export class AddInvoiceComponent implements OnInit {
  invoiceForm!: FormGroup;
  productForm!: FormGroup;
  bankForm!: FormGroup;
  users: any = [];
  user: any = {}
  orders: any = [];
  invoice: any = {};
  products: any = [];
  constructor(private poServ: PurchaseService, private userServ: UsersService,
    private formBuild: FormBuilder, private invServ: InvoiceService, private router: Router) {
    this.invoiceForm = this.formBuild.group({
      invoiceID: ["", [Validators.required]],
      date: ["", [Validators.required]],
      dueDate: ["", [Validators.required]],
      bankName: ["", [Validators.required]],
      accountNumber: ["", [Validators.required]],
      holderNamer: ["", [Validators.required]],
      bankBranch: ["", [Validators.required]],
      email: ["", [Validators.required]],
      discount: ["", [Validators.required]],
      adjustments: ["", [Validators.required]],
      discountTerms: ["", [Validators.required]],
      approvedBy: ["", [Validators.required]],
      referencePO: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      stasus: ["pending"],
      subtotal: ["", [Validators.required]],
      supplier: ['', [Validators.required]],
    })
  }
  ngOnInit(): void {
    let token = JSON.parse(sessionStorage.getItem("user") || "[]");
    console.log(token);
    this.user = jwtDecode(token);
    console.log(this.user);
    // change it to userName later
    this.poServ.getAllPurchasOrder().subscribe(
      (res) => {
        this.orders = res.purchases;
        console.log(this.orders);
      }
    )
    this.userServ.getAllUsers().subscribe(
      (res) => {
        if (res.users) {
          this.users = res.users
        }
      }
    )
  }
  // Method to handle reference selection
  onReferenceChange(event: Event): void {
    const referenceId = (event.target as HTMLSelectElement).value;
    console.log(referenceId);

    this.poServ.getPurchasOrderByID(referenceId).subscribe(
      (response) => {
        if (response.purchase) {
          console.log('Invoice fetched:', response.purchase);

          // Map response products to include only productName and priceHT
          this.products = response.purchase.products.map((product: any) => ({
            productName: product.itemName,
            priceHT: product.priceHT,
            quantity: null,  // User to fill manually
            priceTVA: null,  // User to fill manually
            priceTTC: null,  // Calculated later
          }));
        } else {
          console.error('Invoice not found');
          this.products = []; // Clear the products array if no invoice is found
        }
      },
      (error) => {
        console.error('Error fetching invoice:', error);
        this.products = [];
      }
    );
  }
  addItem() {
    this.products.push({});
  }
  addInvoice() {
    // ... this will spred the form obj
    this.invoice = { ...this.invoiceForm.value, products: this.products }
    this.invoice.userID = this.user.id
    if (this.invoiceForm.invalid) {
      console.log(this.invoice);
      this.invServ.addInvoice(this.invoice).subscribe(
        (res) => {
          if (res.msg == "Invoice added successfully") {
            this.router.navigate(['invoices-list']);
          } else {
            alert(res.msg)
          }
        }
      )
    } else {
      console.log('Form is invalid');
    }
  }
  // Optional: method to remove a row
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
    this.invoiceForm.value.subtotal = subtotal
    return subtotal
  }
  calcAmount(tab: any, dis: any) {
    let amount = this.calcSum(tab) - dis;
    this.invoiceForm.value.amount = amount;
    return amount
  }
  onCustemerChange(event: Event) {
    const customerId = (event.target as HTMLSelectElement).value;
    console.log(customerId);
  }
}
