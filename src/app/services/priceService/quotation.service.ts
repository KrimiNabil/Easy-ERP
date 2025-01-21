import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  quotationURL ='http://localhost:3000/price/quotation'; // Update this URL to match your backend

  constructor(private httpClient: HttpClient) {}
  getDashboardSummary(){
    return this.httpClient.get<{ last:any;status:any;message:string;completedTotal:number}>(`${this.quotationURL}/dashboard/summary/quotation`);
  }

  // Get all Quotations
  getAllQuotations() {
    return this.httpClient.get<{ msg: string; quotations: any }>(this.quotationURL);
  }
  // Get a Quotation by ID
  getQuotationByID(id: any) {
    return this.httpClient.get<{ msg: string; quotation: any }>(`${this.quotationURL}/${id}`);
  }
  // Delete a Quotation by ID
  deleteQuotationByID(id: any) {
    return this.httpClient.delete<{ msg: string }>(`${this.quotationURL}/${id}`);
  }
  // Add a new Quotation
  addQuotation(quotation: any) {
    return this.httpClient.post<{ msg: string; path: any }>(this.quotationURL, quotation);
  }
  // Get a Quotation by its reference Purchase Order (PO)
  getQuotationByPO(poID: any) {
    return this.httpClient.get<{ msg: string; quotation: any }>(`${this.quotationURL}/po/${poID}`);
  }
  // Update a Quotation
  updateQuotation(quotation: any) {
    return this.httpClient.put<{ msg: string }>(this.quotationURL, quotation);
  }
  // update a Quotation by ID
  updateStatuse(id: any,newStatus:any) {
    return this.httpClient.put<{ msg: string ,update:any}>(`${this.quotationURL}/updateStatuse/${id}`,{status:newStatus});
  }
  // Get the total of completed Quotations for charts
  getTotalQuotations() {
    return this.httpClient.get<{ totalQuotations: number }>(`${this.quotationURL}/totals`);
  }

 
  
}
