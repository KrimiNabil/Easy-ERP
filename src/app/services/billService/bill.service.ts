import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BillService {
billURL="http://localhost:3000/bill"
  constructor(private httpClient:HttpClient) { }

  addBill(obj:any){
  return  this.httpClient.post<{msg:string,err:any}>(this.billURL,obj);
  };
  getAllBills(){
   return this.httpClient.get<{msg:string,bills:any}>(this.billURL);
  };
  getPDF(paymentID:any){
    return this.httpClient.get<{msg:string}>(`${this.billURL}/bill/pdf/${paymentID}`);
   };
  getBillByID(id:any){
  return  this.httpClient.get<{msg:string,bill:any}>(`${this.billURL}/${id}`);
  };
  deleteBillByID(id:any){
  return  this.httpClient.delete<{msg:boolean}>(`${this.billURL}/${id}`);
  };
  updateBill(bill:any){
   return this.httpClient.put<{msg:string}>(this.billURL,bill);
  };
}
