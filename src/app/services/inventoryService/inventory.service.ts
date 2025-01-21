import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  inventoryURL = "http://localhost:3000/api/inventory";
  constructor( private httpClient:HttpClient) { }
  getAllInventory() {
    return this.httpClient.get<{ msg: string, inventory: any }>(this.inventoryURL);
  };

  getInventoryItemByID(id: any) {
    return this.httpClient.get<{ msg: string, item: any }>(`${this.inventoryURL}/${id}`);
  };

  addInventoryItem(item: any) {
    return this.httpClient.post<{ msg: string, details: string }>(this.inventoryURL, item);
  };

  updateInventoryItem(item: any) {
    return this.httpClient.put<{ error: string ,updatedItem:any}>(this.inventoryURL+"/newInfo", item);
  };

  deleteInventoryItem(id: any) {
    return this.httpClient.delete<{ msg: string ,error: string }>(`${this.inventoryURL}/${id}`);
  };

  inventoryMovement(movement: any) {
    return this.httpClient.post<{ msg: string, movement: any }>(`${this.inventoryURL}/movement`, movement);
  };

  getMovementsByProductCode(productCode: any) {
    return this.httpClient.get<{ msg: string, movements: any,error:string }>(`${this.inventoryURL}/movement/${productCode}`);
  };
  getSalesGrowth(){
    return this.httpClient.get<{total:any,message:string,salesGrowth:any}>(`${this.inventoryURL}/sales/growth`);
  }
  getAllMovements() {
    return this.httpClient.get<{ msg: string, movements: any[] }>(`${this.inventoryURL}/movements`);
  };

}
