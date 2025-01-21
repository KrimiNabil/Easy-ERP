import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BillService } from 'src/app/services/billService/bill.service';
import { InvoiceService } from 'src/app/services/invoiceService/invoice.service';
import { UsersService } from 'src/app/services/userService/users.service';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.css']
})
export class AddBillComponent implements OnInit {
  billForm!: FormGroup
  getProduct!: FormGroup
  bill: any = {}
  users: any = []
  user: any = {}
  invoice: any = {}
  invoices: any = []
  products: any = []
  constructor(private invServ: InvoiceService, private billServ: BillService, private router: Router, private fb: FormBuilder, private userServ:UsersService) { }
  ngOnInit(): void {
    let token = sessionStorage.getItem("user");
    if (token) {
      this.user = jwtDecode(token)
      console.log(this.user.id);
      
    }
    this.userServ.getAllUsers().subscribe(
      (res)=>{
        this.users=res.users
      }
    )
    this.invServ.getAllInvoices().subscribe(
      (res) => {
        this.invoices = res.invoices
        console.log(res.invoices);
      }
    )
    this.billForm = this.fb.group({
      paymentID: ['', [Validators.required]],
      reference: ['', [Validators.required]],
      date: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      bankName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      branchName: ["", [Validators.required]],
      holderNamer: ["", [Validators.required]],
      swiftCode: ['', [Validators.required]],
      discount: [''],
      supplier:[''],
      signature: [''],
    });
  }
  onReferenceChange(event: Event): void {
    const referenceId = (event.target as HTMLSelectElement).value;
    console.log(referenceId);
    this.invServ.getInvoiceByID(referenceId).subscribe(
      (response) => {
        if (response.invoice) {
          console.log('Invoice fetched:', response.invoice);

          // Store the original products with their max quantities
          this.products = response.invoice.products.map((product: any) => ({
            productName: product.productName,
            priceHT: product.priceHT,
            maxQuantity: product.quantity, // Original max quantity
           quantity: null,  // User to fill manually
            priceTVA: null,  // User to fill manually
            priceTTC: null,  // Calculated later
          }));
        } else {
          console.error('Invoice not found');
          this.products = [];
        }
      },
      (error) => {
        console.error('Error fetching invoice:', error);
        this.products = [];
      }
    );
}
validateQuantity(index: number): void {
  console.log(this.products);
  
  const product = this.products[index];
  console.log(product);
  
  // if (product.quantity > product.maxQuantity) {
  //     alert(`Quantity for ${product.productName} cannot exceed ${product.maxQuantity}.`);
  //     product.quantity = product.maxQuantity; // Reset to max value
  // }
}

  addBill() {
    

    if (this.billForm.valid) {
      this.bill = { ...this.billForm.value, products: this.products }
      this.bill.userID = this.user.id;
      console.log("this is object sent to BE", this.bill);
      this.billServ.addBill(this.bill).subscribe(
        (res) => {
          console.log(res);
          if (res.msg == "bill saved") {
            this.router.navigate(['bills-list'])
          }
        }
      )
    } else {
      console.log('Form is invalid');
    }
  }

  addItem() {
    this.products.push({});
  }
  getInvoice(invoiceID: any) {
    console.log(invoiceID);
    this.invServ.getInvoice(invoiceID).subscribe(
      (res) => {
        this.invoice = res.invoice
        console.log(this.invoice);
      }
    )
  }
  removeItem(index: number) {
    console.log(index);
    this.products.splice(index, 1);
  }

  updateTTC(product: any) {
    const total = product.quantity * product.priceHT;
    const tvaAmount = (product.priceTVA / 100) * total;
    product.priceTTC = total + tvaAmount;
  }
  calcSum(tab: any) {
    return tab.reduce((sum: number, elt: any) => sum + elt.priceTTC, 0);
  }
  calcAmount(tab: any, dis: any) {
    let amount = this.calcSum(tab) - dis;
    this.bill.amount = amount;
    return amount
  }
  onCustemerChange(event: Event) {
    const customerId = (event.target as HTMLSelectElement).value;
    console.log(customerId);
  }
  generateProductCode() {
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    const code = `${timestamp}${randomNumber}`; // Combine them

    // Set the value of paymentID form control
    this.billForm.get('paymentID')?.setValue(code);

    console.log('Generated Code:', code);
}

}
