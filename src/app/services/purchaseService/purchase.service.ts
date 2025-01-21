import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
prchaseURL="http://localhost:3000/purchaseOrder"
  constructor(private httpClient:HttpClient) { }
  getPurchasOrderByID(id:any){
  return  this.httpClient.get<{msg:string,purchase:any}>(`${this.prchaseURL}/${id}`)
  };
  getAllPurchasOrder(){
   return this.httpClient.get<{msg:string,purchases:any}>(this.prchaseURL)
  };
  deletePurchasOrderByID(id:any){
   return this.httpClient.delete<{msg:string}>(`${this.prchaseURL}/${id}`)
  };
  updatePurchasOrder(order:any){
   return this.httpClient.put<{msg:string}>(this.prchaseURL,order)
  };
  addPurchasOrder(order:any,pdf:File){
    // purchaseOrder + img price seller
    let fData=new FormData();
    fData.append("price",pdf)
    // fData.append("avatar",img)
    fData.append("purchaseOrder",order.purchaseOrderID)
    fData.append("poDate",order.date)
    fData.append("date",order.aprdate)
    fData.append("amount",order.amount)
    fData.append("discountTerms",order.discountTerms)
    fData.append("discount",order.discount)
    fData.append("adjustments",order.adjustments)
    fData.append("approvedBy",order.approvedBy)
    fData.append("purchaseRequsitionsID",order.reference)
    fData.append("products.itemName",order.products.itemName)
    fData.append("products", JSON.stringify(order.products)); // Serialize products as JSON
    fData.append("userID",order.userID)
    
  return  this.httpClient.post<{msg:string, path: string}>(this.prchaseURL,fData)
  };
  // addPurchasOrder(order:any){
    
  // return  this.httpClient.post<{msg:string}>(this.prchaseURL,order)
  // };
}
