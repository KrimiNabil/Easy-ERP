import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequisitionServiceService {
requisitionURL="http://localhost:3000/requisition"
  constructor(private httpClent:HttpClient) {
   }
   addRequisition(requsition:any){
    
    return this.httpClent.post<{msg:string, path:string,error: string}>(this.requisitionURL,requsition);
   }
   getRequisitions(){
    return this.httpClent.get<{msg:string,requisitions: any}>(this.requisitionURL);
   }
   getRequisitionById(id:any){
    return this.httpClent.get<{ msg: string, requisition: any }>(`${this.requisitionURL}/${id}`);
   }
   deleteRequisitionById(id:any){
    return this.httpClent.delete<{msg:boolean}>(`${this.requisitionURL}/${id}`);
   }
   upDate(newRequisition:any){
    return this.httpClent.put<{ msg: boolean }>(this.requisitionURL,newRequisition);
   }
}
