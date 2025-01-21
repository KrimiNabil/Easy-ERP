import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventoryService/inventory.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  invetories: any = []
  inventoryData: any = []; // Holds the selected inventory item
  notificationMessage: string = ''; // Message to display in the popup/modal
  showNotification: boolean = false;
  success: boolean = false; // Initialize with a default value

  movementData: any = {}
  inventoryMovements: any = []; // Holds the fetched movement history
  selectedItem: any = {}; // Holds details of the selected item (e.g., name, productCode)
  constructor(private invServ: InventoryService) { }

  ngOnInit(): void {
    this.invServ.getAllInventory().subscribe(
      (res) => {
        this.invetories = res.inventory
      }
    )
  }

  fetchInventoryHistory(id: any, name: string) {
    // Clear existing data
    this.selectedItem = {}
    this.inventoryMovements = [];
    this.selectedItem = { id, name }; // Placeholder
    this.invServ.getMovementsByProductCode(id).subscribe(
      (res) => {
        this.inventoryMovements = res.movements

      }
    )
  }

  slectedItem(id: any) {
    this.movementData.productCode = id
   
  }

  openEditModal(product: string) {
    this.inventoryData = product;
  }

  makeMovement(movement: string) {
   
    this.movementData.movementType = movement
   
    
    this.invServ.inventoryMovement(this.movementData).subscribe(
      (res) => {
        if (res.movement) {
          this.invServ.getAllInventory().subscribe(
            (res) => {
              this.invetories = res.inventory
              console.log(this.invetories);
            }
          )
        }
      }
    )
  }

  updateInventory() {
    this.invServ.updateInventoryItem(this.inventoryData).subscribe(
      (res) =>  {
        if(res.updatedItem){
          this.success = true; // Set success to true on successful update
          this.showNotificationPopup('Inventory updated successfully!', this.success);
          setTimeout(() => window.location.reload(), 3000); // Refresh the page after 2 seconds
        }else{
          this.success = false; // Set success to true on successful update
          this.showNotificationPopup('Failed to update inventory. Please try again.',  this.success);
        }
      }
    )
  }

   showNotificationPopup(message: string, success: boolean) {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000); // Hide the popup after 3 seconds
  }
  
  deleteProduct(id:any){
    if (!confirm('Are you sure you want to delete this item?')) return; // Confirmation prompt
    this.invServ.deleteInventoryItem(id).subscribe(
      (res)=>{
        if (res.msg) {
          this.success = true;
        this.showNotificationPopup(res.msg || 'Item deleted successfully!', this.success);
        this.invServ.getAllInventory().subscribe(
          (res) => {
            this.invetories = res.inventory
          }
        )
        } else {
          this.success = false;
          const errorMessage = res.error || 'Failed to delete item. Please try again.';
          this.showNotificationPopup(errorMessage, this.success);
        }
      }
    )
  }
}
