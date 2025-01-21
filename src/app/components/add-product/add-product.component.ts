import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from 'src/app/services/inventoryService/inventory.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  inventoryForm!:FormGroup
  inventoryData:any={}
  constructor(private inventoryServ:InventoryService, private router:Router) { }

  ngOnInit(): void {
  }
  generateProductCode() {
    // Generate a unique code using the current timestamp and a random number
    const timestamp = Date.now(); // Current time in milliseconds
    const randomString = Math.random().toString(36).substring(2, 6).toUpperCase(); // Random alphanumeric string
    this.inventoryData.code = `PROD-${timestamp}-${randomString}`;
    console.log('Generated Code:', this.inventoryData.code);
  }

  addProduct(){
    console.log(this.inventoryData);
    this.inventoryServ.addInventoryItem(this.inventoryData).subscribe(
      (res)=>{
        if (res.msg=="added with success") {
          this.router.navigate(['inventory'])
        } else {
          
        }
      }
    )
    
  }
}
